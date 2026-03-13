"use client";

import { useUiStore } from "@/store/uiStore";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export function Toast() {
  const toast = useUiStore((state) => state.toast);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-fade-in">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg border ${
          isError
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-green-50 border-green-200 text-green-800"
        }`}
      >
        {isError ? (
          <AlertCircle size={18} className="flex-shrink-0" />
        ) : (
          <CheckCircle size={18} className="flex-shrink-0" />
        )}
        <span className="text-sm font-sans font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
