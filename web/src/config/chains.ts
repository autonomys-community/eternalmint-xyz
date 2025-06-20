import { Chain } from "wagmi/chains";

// Autonomys Taurus Auto EVM Configuration (Current Active Network)
export const autonomysTaurusAutoEVM: Chain = {
  id: 490000,
  name: "Autonomys Taurus Auto EVM",
  nativeCurrency: {
    decimals: 18,
    name: "tAI3",
    symbol: "tAI3",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://auto-evm.taurus.autonomys.xyz/ws"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://auto-evm.taurus.autonomys.xyz/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Taurus Auto EVM Explorer",
      url: "https://explorer.auto-evm.taurus.autonomys.xyz",
    },
  },
  testnet: true,
};

// TODO: Autonomys Mainnet Auto EVM Configuration (Coming Soon)
// export const autonomysMainnetAutoEVM: Chain = {
//   id: TBD,
//   name: "Autonomys Mainnet Auto EVM",
//   nativeCurrency: {
//     decimals: 18,
//     name: "AI3",
//     symbol: "AI3",
//   },
//   rpcUrls: {
//     default: {
//       http: ["https://auto-evm.autonomys.xyz"],
//     },
//     public: {
//       http: ["https://auto-evm.autonomys.xyz"],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "Autonomys Explorer",
//       url: "https://explorer.autonomys.xyz",
//     },
//   },
//   testnet: false,
// };

// Export the current active chain
export const currentChain = autonomysTaurusAutoEVM;

// Legacy export for backward compatibility (DEPRECATED - use autonomysTaurusAutoEVM)
export const autonomysNovaTestnet = autonomysTaurusAutoEVM;

 