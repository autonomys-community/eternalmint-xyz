"use client";

import { BATCH_SIZES } from "@/config/constants";
import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const DISTRIBUTION_ABI = [
  {
    inputs: [
      { name: "recipients", type: "address[]" },
      { name: "tokenIds", type: "uint256[]" },
      { name: "amounts", type: "uint256[]" }
    ],
    name: "batchTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "recipients", type: "address[]" },
      { name: "amounts", type: "uint256[]" }
    ],
    name: "distributeToMany",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "distributeSingle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

export function useDistribution() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess, isError: isTxError } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const distributeSingle = async (tokenId: string, recipient: string, amount: string) => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: DISTRIBUTION_ABI,
        functionName: "distributeSingle",
        args: [BigInt(tokenId), recipient as `0x${string}`, BigInt(amount)]
      });

      setTxHash(hash);
      return hash;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Distribution failed";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const distributeToMany = async (tokenId: string, recipients: string[], amounts: string[]) => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const recipientChunks = chunkArray(recipients, BATCH_SIZES.distribution);
      const amountChunks = chunkArray(amounts, BATCH_SIZES.distribution);
      
      let lastHash = "";

      for (let i = 0; i < recipientChunks.length; i++) {
        const hash = await writeContractAsync({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: DISTRIBUTION_ABI,
          functionName: "distributeToMany",
          args: [
            BigInt(tokenId),
            recipientChunks[i] as `0x${string}`[],
            amountChunks[i].map(amount => BigInt(amount))
          ]
        });

        lastHash = hash;
        
        // If there are more batches, wait for this one to confirm before proceeding
        if (i < recipientChunks.length - 1) {
          // Wait a bit between batches to avoid nonce issues
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      setTxHash(lastHash);
      return lastHash;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Distribution failed";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const batchTransfer = async (recipients: string[], tokenIds: string[], amounts: string[]) => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const recipientChunks = chunkArray(recipients, BATCH_SIZES.distribution);
      const tokenIdChunks = chunkArray(tokenIds, BATCH_SIZES.distribution);
      const amountChunks = chunkArray(amounts, BATCH_SIZES.distribution);
      
      let lastHash = "";

      for (let i = 0; i < recipientChunks.length; i++) {
        const hash = await writeContractAsync({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: DISTRIBUTION_ABI,
          functionName: "batchTransfer",
          args: [
            recipientChunks[i] as `0x${string}`[],
            tokenIdChunks[i].map(id => BigInt(id)),
            amountChunks[i].map(amount => BigInt(amount))
          ]
        });

        lastHash = hash;
        
        // If there are more batches, wait for this one to confirm before proceeding
        if (i < recipientChunks.length - 1) {
          // Wait a bit between batches to avoid nonce issues
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      setTxHash(lastHash);
      return lastHash;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Distribution failed";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  // Set loading to false when transaction is confirmed or failed
  if ((isSuccess || isTxError) && isLoading) {
    setIsLoading(false);
  }

  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setTxHash(null);
  };

  return {
    distributeSingle,
    distributeToMany,
    batchTransfer,
    isLoading: isLoading || isConfirming,
    error,
    txHash,
    resetState,
    isSuccess,
    isConfirming
  };
} 