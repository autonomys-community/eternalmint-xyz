"use client";

import { keccak256, toUtf8Bytes } from 'ethers';
import { useAccount, useReadContract } from "wagmi";

// Calculate MINTER_ROLE hash once when module is imported
const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));

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
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "hasRole",
    args: [MINTER_ROLE, address!],
    query: {
      enabled: !!address && isConnected,
    },
  });

  return {
    hasMinterRole: !!hasRole,
    isLoading,
    error,
    isConnected,
  };
} 