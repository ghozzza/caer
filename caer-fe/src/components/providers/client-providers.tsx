"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { pharosChain } from "@/lib/data/chain-data";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";
import Providers from "@/app/providers";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  // Hide navbar on home page
  const shouldShowNavbar = pathname !== "/";

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={pharosChain}
          theme={lightTheme({
            accentColor: "#141beb",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <div className="">
            {shouldShowNavbar && (
              <div className="relative z-99">
                <Navbar />
              </div>
            )}
            <div className={`relative z-10 ${shouldShowNavbar ? "mt-5" : ""}`}>
              <Providers>{children}</Providers>
            </div>
            <Toaster />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}