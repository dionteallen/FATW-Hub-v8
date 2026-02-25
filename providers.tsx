"use client";

import React from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { thirdwebClient } from "@/lib/thirdwebClient";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

const queryClient = new QueryClient();

const appName = process.env.NEXT_PUBLIC_APP_NAME || "FATW Hub";
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID";

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"),
  },
  connectors: [
    coinbaseWallet({ appName }),
    walletConnect({ projectId: walletConnectProjectId, showQrModal: true }),
  ],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider client={thirdwebClient}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </ThirdwebProvider>
  );
}
