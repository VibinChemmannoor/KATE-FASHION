"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (res.ok) {
        setOrders(json.data);
      }
    } catch {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-blue-100 text-blue-800",
      PROCESSING: "bg-purple-100 text-purple-800",
      SHIPPED: "bg-indigo-100 text-indigo-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#6B4F3B]" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-4xl">
        <div className="flex items-center text-xs text-[#6B4F3B]/60 mb-8 font-sans">
          <Link href="/" className="hover:text-[#EC7F13]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1a1b26]">My Orders</span>
        </div>

        <h1 className="text-3xl font-bold font-serif text-[#1a1b26] mb-10">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#EAE4DD] rounded-xl">
            <Package size={48} className="mx-auto text-[#6B4F3B]/30 mb-4" />
            <p className="text-[#6B4F3B]/70 font-sans mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#1a1b26] text-white px-8 py-3 rounded text-sm font-bold tracking-wider hover:bg-[#4A3525] transition-colors"
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block border border-[#EAE4DD] rounded-xl p-6 hover:border-[#D47112]/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] text-[#6B4F3B]/60 uppercase mb-1">
                      Order {order.orderNumber}
                    </p>
                    <p className="text-xs text-[#6B4F3B]/50 font-sans">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <ChevronRight size={16} className="text-[#6B4F3B]/40" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-lg bg-[#F2EDEA] overflow-hidden relative flex-shrink-0"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package size={20} className="text-[#6B4F3B]/20" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-[#6B4F3B]/60 font-sans">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#F5F0E6]">
                  <span className="text-sm text-[#6B4F3B]/70 font-sans">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                  </span>
                  <span className="text-lg font-bold font-serif text-[#1a1b26]">
                    &#8377;{order.totalAmount.toFixed(0)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
