"use client";

import { APP_CONFIG } from "@/config/app";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@/config/constants";
import { useAccount, useReadContract } from "wagmi";

export function useHasMinterRole() {
  const { address, isConnected } = useAccount();

  const { data: hasRole, isLoading, error } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: APP_CONFIG.contract.address as `0x${string}`,
    functionName: "hasRole",
    args: [MINTER_ROLE, address!],
    query: {
      enabled: !!address && isConnected,
    },
  });

  const { data: hasAdminRole } = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: APP_CONFIG.contract.address as `0x${string}`,
    functionName: "hasRole",
    args: [DEFAULT_ADMIN_ROLE, address!],
    query: {
      enabled: !!address && isConnected,
    },
  });

  return {
    hasMinterRole: !!hasRole,
    hasAdminRole: !!hasAdminRole,
    canAccessDistribution: !!hasRole || !!hasAdminRole, // Can distribute if minter OR admin
    isLoading,
    error,
    isConnected,
  };
}

// Hook to check if user can distribute a specific NFT
export function useCanDistributeNFT(tokenId?: string) {
  const { address, isConnected } = useAccount();

  const { data: canDistribute, isLoading } = useReadContract({
    abi: [
      {
        inputs: [
          { name: "user", type: "address" },
          { name: "tokenId", type: "uint256" }
        ],
        name: "canUserDistribute",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function"
      }
    ],
    address: APP_CONFIG.contract.address as `0x${string}`,
    functionName: "canUserDistribute",
    args: [address!, BigInt(tokenId || "0")],
    query: {
      enabled: !!address && isConnected && !!tokenId,
    },
  });

  return {
    canDistribute: !!canDistribute,
    isLoading,
  };
} 