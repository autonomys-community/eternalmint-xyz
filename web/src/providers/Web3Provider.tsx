"use client";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { Chain } from "wagmi/chains";

export const nova: Chain = {
  id: 490000,
  name: "Gemini 3h Nova - Subspace Testnet",
  // network: 'nova',
  nativeCurrency: {
    decimals: 18,
    name: "tSSC",
    symbol: "tSSC",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || ""],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || ""],
    },
  },
  blockExplorers: {
    default: {
      name: "Nova Explorer",
      url: "https://nova.subspace.network",
    },
  },
};

const config = getDefaultConfig({
  appName: "Eternal Mint",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [nova],
  ssr: true,
});

export const Web3Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#D914E4",
            accentColorForeground: "white",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
