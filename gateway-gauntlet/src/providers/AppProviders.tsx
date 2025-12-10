"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/components/WalletProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { ReactNode } from "react";

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <WalletProvider>{children}</WalletProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
