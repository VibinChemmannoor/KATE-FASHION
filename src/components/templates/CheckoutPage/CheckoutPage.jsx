"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { AddressForm } from "@/components/organisms/AddressForm";
import { AddressSelector } from "@/components/organisms/AddressSelector";
import { PriceDetails } from "@/components/molecules/PriceDetails";
import { useCart } from "@/hooks/useCart";
import { usePayment } from "@/hooks/usePayment";

const SHIPPING_FEE_STANDARD = 100;
const SHIPPING_FEE_EXPRESS = 250;
const FREE_SHIPPING_THRESHOLD = 1499;

export function CheckoutPage() {
  const router = useRouter();
  const { items, total, itemCount } = useCart();
  const { initiatePayment, isProcessing, error: paymentError } = usePayment();

  const [view, setView] = useState("form");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryType, setDeliveryType] = useState("standard");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      const json = await res.json();
      if (res.ok && json.data?.length > 0) {
        setAddresses(json.data);
        const defaultAddr = json.data.find((a) => a.isDefault) || json.data[0];
        setSelectedAddressId(defaultAddr.id);
        setView("selector");
      }
    } catch {
      // No saved addresses, show form
    }
  };

  const shippingFee =
    total >= FREE_SHIPPING_THRESHOLD
      ? 0
      : deliveryType === "express"
        ? SHIPPING_FEE_EXPRESS
        : SHIPPING_FEE_STANDARD;

  const handleAddAddress = async (formData) => {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          city: formData.town || formData.city,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to save address");
      }

      setAddresses((prev) => [...prev, json.data]);
      setSelectedAddressId(json.data.id);
      setView("selector");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNewFromSelector = () => {
    setView("form");
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddressId && view === "selector") {
      setError("Please select a shipping address");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsCreatingOrder(true);
    setError(null);

    try {
      const selectedAddress = addresses.find(
        (a) => a.id === selectedAddressId
      );

      if (!selectedAddress) {
        throw new Error("Please select a shipping address");
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            email: selectedAddress.email || "",
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state || "",
            pincode: selectedAddress.pincode,
          },
          deliveryType,
        }),
      });

      const orderJson = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderJson.error || "Failed to create order");
      }

      const result = await initiatePayment(orderJson.data.orderId);

      if (result?.success) {
        router.push(
          `/checkout/success?orderNumber=${result.orderNumber}&orderId=${result.orderId}`
        );
      }
    } catch (err) {
      if (err.message !== "Payment cancelled by user") {
        setError(err.message);
      }
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const isLoading = isCreatingOrder || isProcessing;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-[#6B4F3B]/60 mb-8 font-sans">
          <Link href="/cart" className="hover:text-[#EF831D]">
            Cart
          </Link>
          <ChevronRight size={14} className="mx-1 opacity-50" />
          <span
            className={
              view === "form" || view === "selector"
                ? "text-[#1a1b26] font-bold"
                : ""
            }
          >
            Shipping Address
          </span>
          <ChevronRight size={14} className="mx-1 opacity-50" />
          <span className={isLoading ? "text-[#1a1b26] font-bold" : "opacity-50"}>
            Payment
          </span>
        </div>

        {/* Error Message */}
        {(error || paymentError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error || paymentError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative items-start">
          <div className="flex-1 w-full max-w-3xl">
            {view === "form" ? (
              <AddressForm onAddAddress={handleAddAddress} />
            ) : (
              <AddressSelector
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={handleSelectAddress}
                onAddNew={handleAddNewFromSelector}
                deliveryType={deliveryType}
                onDeliveryTypeChange={handleDeliveryTypeChange}
              />
            )}
          </div>

          <div className="w-full lg:w-[400px] flex-shrink-0">
            <PriceDetails
              orderValue={total}
              deliveryFee={shippingFee}
              discount={0}
              totalItems={itemCount}
              onPrimaryAction={handleProceedToPayment}
              primaryActionText={
                isLoading ? "PROCESSING..." : "PROCEED TO PAYMENT"
              }
              showSignIn={false}
              isCheckoutPage={true}
            />

            {view === "selector" && (
              <div className="mt-6 flex items-center justify-between border border-[#EAE4DD] bg-[#FAF9F6] rounded-lg p-5 cursor-pointer hover:border-[#EF831D]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-[#FDF0DF] rounded text-[#EF831D]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="8" width="18" height="14" rx="2"></rect>
                      <path d="M12 5a3 3 0 1 0-3 3"></path>
                      <path d="M15 8a3 3 0 1 0-3-3"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-sans text-[#4A3525] mb-0.5">
                      APPLY COUPON
                    </h4>
                    <p className="text-[10px] font-sans text-[#6B4F3B]/60 uppercase tracking-widest">
                      Check for available offers
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#EF831D]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
