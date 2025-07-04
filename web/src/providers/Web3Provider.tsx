"use client";

import { APP_CONFIG } from "@/config/app";
import { currentChain } from "@/config/chains";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";

const config = getDefaultConfig({
  appName: APP_CONFIG.name,
  projectId: APP_CONFIG.services.walletConnect.projectId,
  chains: [currentChain],
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
