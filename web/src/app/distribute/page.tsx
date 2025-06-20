"use client";

import { AccessDenied } from "@/components/AccessDenied";
import DistributionForm from "@/components/DistributionForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useHasMinterRole } from "@/hooks/useHasMinterRole";
import { useAccount } from "wagmi";

export default function DistributePage() {
  const { isConnected } = useAccount();
  const { canAccessDistribution, isLoading } = useHasMinterRole();

  if (!isConnected) {
    return (
      <div className="min-h-screen p-4 pb-12 sm:px-40 text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-gray-300">Please connect your wallet to access the distribution interface.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 pb-12 sm:px-40 text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Checking permissions...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!canAccessDistribution) {
    return (
      <div className="min-h-screen p-4 pb-12 sm:px-40 text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <AccessDenied 
            title="Distribution Access Required"
            message="You need either contract admin permissions or MINTER_ROLE to distribute NFTs. Only contract admins and NFT creators can access this feature."
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-12 sm:px-40 text-white">
      <Header />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NFT Distribution</h1>
          <p className="text-gray-300 text-lg">
            Distribute your minted NFTs to multiple recipients efficiently
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Available to contract admins and NFT creators
          </p>
        </div>
        
        <DistributionForm />
      </div>
      <Footer />
    </div>
  );
} 