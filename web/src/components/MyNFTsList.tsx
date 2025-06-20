"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NFT } from "../types";
import { NftContainer } from "./NftContainer";

interface OwnedNFT {
  id: string;
  tokenId: string;
  balance: number;
  cid: string;
  image: string;
  name: string;
  description: string;
  quantity: number;
}

export const MyNFTsList: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!address || !isConnected) return;

      setLoading(true);
      setError(null);

      try {
        // First, get user's owned tokens from the contract
        const tokensResponse = await fetch("/api/utils/contract-call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: "getUserTokens",
            args: [address]
          })
        });

        if (!tokensResponse.ok) {
          throw new Error("Failed to fetch user tokens");
        }

        const tokensData = await tokensResponse.json();
        const [tokenIds, balances] = tokensData.result;

        if (!tokenIds || tokenIds.length === 0) {
          setOwnedNFTs([]);
          setLoading(false);
          return;
        }

        // Fetch details for each owned token
        const nfts: OwnedNFT[] = [];

        for (let i = 0; i < tokenIds.length; i++) {
          try {
            const tokenId = tokenIds[i].toString();
            const balance = parseInt(balances[i].toString());

            // Skip tokens with zero balance
            if (balance === 0) continue;

            // Get CID for this token
            const cidResponse = await fetch("/api/utils/contract-call", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                method: "getCID",
                args: [tokenId]
              })
            });

            if (!cidResponse.ok) continue;

            const cidData = await cidResponse.json();
            const cid = cidData.result;

            // Get supply for this token
            const supplyResponse = await fetch("/api/utils/contract-call", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                method: "getSupply",
                args: [tokenId]
              })
            });

            if (!supplyResponse.ok) continue;

            const supplyData = await supplyResponse.json();
            const supply = parseInt(supplyData.result);

            // Fetch metadata to get image, name, description
            let imageUrl = "";
            let name = "";
            let description = "";

            try {
              const metadataResponse = await fetch(`/api/cid/taurus/${cid}`);
              if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                imageUrl = metadata.image || "";
                name = metadata.name || `NFT ${tokenId}`;
                description = metadata.description || "";
              }
            } catch (error) {
              console.error(`Error fetching metadata for token ${tokenId}:`, error);
              name = `NFT ${tokenId}`;
            }

            nfts.push({
              id: `${address}-${tokenId}`,
              tokenId,
              balance,
              cid,
              image: imageUrl,
              name,
              description,
              quantity: balance
            });

          } catch (error) {
            console.error(`Error processing token ${tokenIds[i]}:`, error);
          }
        }

        setOwnedNFTs(nfts);
      } catch (error) {
        console.error("Error fetching owned NFTs:", error);
        setError("Failed to load your NFTs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedNFTs();
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-300 mb-6">
          Connect your wallet to view your Eternal NFTs
        </p>
        <button
          onClick={openConnectModal}
          className="px-6 py-3 bg-gradient-to-r from-[#1E58FC] via-[#D914E4] to-[#F10419] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Loading Your NFTs...</h2>
        <p className="text-gray-300">
          Please wait while we fetch your Eternal NFTs
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-red-200">Error</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (ownedNFTs.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No NFTs Found</h2>
        <p className="text-gray-300 mb-6">
          You don't own any Eternal NFTs yet
        </p>
        <a
          href="/create"
          className="px-6 py-3 bg-gradient-to-r from-[#1E58FC] via-[#D914E4] to-[#F10419] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Create Your First NFT
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Your Eternal NFTs ({ownedNFTs.length})
        </h2>
        <p className="text-gray-300">
          You own {ownedNFTs.reduce((total, nft) => total + nft.balance, 0)} total NFTs
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {ownedNFTs.map((nft) => (
          <NftContainer 
            key={nft.id} 
            nft={{
              id: nft.id,
              image: nft.image,
              name: nft.name,
              description: nft.description,
              quantity: nft.quantity,
              cid: nft.cid
            } as NFT}
          />
        ))}
      </ul>
    </div>
  );
}; 