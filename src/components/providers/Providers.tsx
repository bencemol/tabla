"use client";

import { SWRConfig } from "swr";

type ProvidersProps = {
  children: React.ReactNode;
  fallback?: Record<string, any>;
};

export default function Providers({ children, fallback }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      {children}
    </SWRConfig>
  );
}
