"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for Razorpay payment integration
 * @returns {Object} Payment state and actions
 */
export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(
    async (orderId) => {
      setIsProcessing(true);
      setError(null);

      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load payment gateway");
        }

        const res = await fetch("/api/payment/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to create payment order");
        }

        const { data } = await res.json();

        return new Promise((resolve, reject) => {
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: "KATE FASHION",
            description: `Order ${data.orderNumber}`,
            order_id: data.razorpayOrderId,
            prefill: data.prefill,
            theme: {
              color: "#6B4F3B",
            },
            handler: async (response) => {
              try {
                const verifyRes = await fetch(
                  "/api/payment/razorpay/verify",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      razorpayOrderId: response.razorpay_order_id,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpaySignature: response.razorpay_signature,
                    }),
                  }
                );

                const verifyJson = await verifyRes.json();

                if (!verifyRes.ok) {
                  throw new Error(
                    verifyJson.error || "Payment verification failed"
                  );
                }

                setIsProcessing(false);
                resolve(verifyJson.data);
              } catch (err) {
                setIsProcessing(false);
                setError(err.message);
                reject(err);
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                reject(new Error("Payment cancelled by user"));
              },
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.on("payment.failed", (response) => {
            setIsProcessing(false);
            setError(response.error.description);
            reject(new Error(response.error.description));
          });
          razorpay.open();
        });
      } catch (err) {
        setIsProcessing(false);
        setError(err.message);
        throw err;
      }
    },
    [loadRazorpayScript]
  );

  return {
    initiatePayment,
    isProcessing,
    error,
    clearError: () => setError(null),
  };
}
