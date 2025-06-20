"use client";

import { AccessDenied } from "@/components/AccessDenied";
import { CreateNFTForm } from "@/components/CreateNFTForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useHasMinterRole } from "@/hooks/useHasMinterRole";

export default function CreatePage() {
  const { hasMinterRole, isLoading, isConnected } = useHasMinterRole();

  return (
    <div className="min-h-screen p-4 pb-12 sm:px-40 text-white">
      <Header />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Create Eternal NFTs</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Checking permissions...</div>
        </div>
      ) : !isConnected ? (
        <AccessDenied 
          title="Wallet Not Connected"
          message="Please connect your wallet to access the NFT creation feature."
        />
      ) : !hasMinterRole ? (
        <AccessDenied 
          title="MINTER Role Required"
          message="You need MINTER_ROLE permissions to create NFTs. Contact an administrator to get access."
        />
      ) : (
        <CreateNFTForm />
      )}
      
      <Footer />
    </div>
  );
}
