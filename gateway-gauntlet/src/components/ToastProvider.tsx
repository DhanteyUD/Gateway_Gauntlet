"use client";

import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, XCircle, Info, AlertTriangle, Zap } from "lucide-react";

const toastConfig = {
  style: {
    background: "#1b1718",
    color: "#ffffff",
    border: "1px solid #e5ff4a/30",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },
  duration: 4000,
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={toastConfig}
        containerStyle={{
          top: 80,
        }}
      />
    </>
  );
};

// Custom toast functions
export const toastService = {
  // Success toast
  success: (message: string) => {
    toast.success(message, {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      style: {
        ...toastConfig.style,
        borderColor: "#10b981",
        background:
          "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(27, 23, 24, 0.95) 100%)",
      },
    });
  },

  // Error toast
  error: (message: string) => {
    toast.error(message, {
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      style: {
        ...toastConfig.style,
        borderColor: "#ef4444",
        background:
          "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(27, 23, 24, 0.95) 100%)",
      },
    });
  },

  // Info toast
  info: (message: string) => {
    toast(message, {
      icon: <Info className="w-5 h-5 text-blue-400" />,
      style: {
        ...toastConfig.style,
        borderColor: "#3b82f6",
        background:
          "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(27, 23, 24, 0.95) 100%)",
      },
    });
  },

  // Warning toast
  warning: (message: string) => {
    toast(message, {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      style: {
        ...toastConfig.style,
        borderColor: "#f59e0b",
        background:
          "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(27, 23, 24, 0.95) 100%)",
      },
    });
  },

  // Gateway-specific toasts
  gatewaySuccess: (message: string) => {
    toast.success(message, {
      icon: <Zap className="w-5 h-5 text-[#e5ff4a]" />,
      style: {
        ...toastConfig.style,
        borderColor: "#e5ff4a",
        background:
          "linear-gradient(135deg, rgba(229, 255, 74, 0.1) 0%, rgba(27, 23, 24, 0.95) 100%)",
      },
      duration: 3000,
    });
  },

  // Transaction toasts
  transactionSuccess: (signature: string, cost: number) => {
    toast.success(
      <div className="flex flex-col">
        <span className="font-semibold">Transaction Successful!</span>
        <span className="text-sm text-gray-300 mt-1">
          Cost: {cost.toFixed(4)} SOL • {signature.slice(0, 8)}...
        </span>
      </div>,
      {
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        style: {
          ...toastConfig.style,
          borderColor: "#10b981",
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(27, 23, 24, 0.95) 100%)",
        },
        duration: 5000,
      }
    );
  },

  transactionFailed: (strategy: string, error?: string) => {
    toast.error(
      <div className="flex flex-col">
        <span className="font-semibold">Transaction Failed</span>
        <span className="text-sm text-gray-300 mt-1">
          Strategy: {strategy} • {error || "Network issue"}
        </span>
      </div>,
      {
        icon: <XCircle className="w-5 h-5 text-red-400" />,
        style: {
          ...toastConfig.style,
          borderColor: "#ef4444",
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(27, 23, 24, 0.95) 100%)",
        },
        duration: 5000,
      }
    );
  },

  // Loading toast with promise
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        ...toastConfig.style,
        borderColor: "#3b82f6",
      },
    });
  },

  // Update loading toast to success/error
  update: (toastId: string, type: "success" | "error", message: string) => {
    const icon =
      type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400" />
      );

    toast.dismiss(toastId);
    toast[type](message, {
      icon,
      style:
        type === "success"
          ? {
              ...toastConfig.style,
              borderColor: "#10b981",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(27, 23, 24, 0.95) 100%)",
            }
          : {
              ...toastConfig.style,
              borderColor: "#ef4444",
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(27, 23, 24, 0.95) 100%)",
            },
    });
  },
};
