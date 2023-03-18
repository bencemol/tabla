"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useRef } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { current: queryClient } = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
