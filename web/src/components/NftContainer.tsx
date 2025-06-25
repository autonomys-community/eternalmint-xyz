"use client";

import { getMetadataApiUrl, getStorageApiUrl, getStorageUrl } from "@/config/constants";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Metadata, NFT } from "../types";
import { TransferModal } from "./TransferModal";

interface NftContainerProps {
  nft: NFT;
  showTransferButton?: boolean;
  onQuantityUpdate?: (tokenId: string, newQuantity: number) => void;
}

export const NftContainer: React.FC<NftContainerProps> = ({ nft, showTransferButton = false, onQuantityUpdate }) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [modalNft, setModalNft] = useState(nft);

  const handleLoadMetadata = useCallback(async (cid: string) => {
    try {
      // For metadata CIDs from subgraph, construct URL directly using current storage network
      const metadataApiUrl = getMetadataApiUrl(cid);
      
      const res = await fetch(metadataApiUrl);
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      
      const metadata = await res.json();
      const imageUrl = metadata.image ? getStorageApiUrl(metadata.image) : "";
      return {
        ...metadata,
        image: imageUrl,
      };
    } catch (error) {
      console.error("Error loading metadata", error);
      throw error;
    }
  }, []);

  const handleLoadMetadataWithFallback = useCallback(
    async (cid: string) => {
      try {
        const metadata = await handleLoadMetadata(cid);
        setMetadata(metadata);
      } catch (error) {
        console.error("Error loading metadata", error);
        await new Promise((resolve) => setTimeout(resolve, 500));
        try {
          const metadata = await handleLoadMetadata(cid);
          setMetadata(metadata);
        } catch (error) {
          console.error("Error loading metadata a second time", error);
        }
      }
    },
    [handleLoadMetadata]
  );

  const metadataCid = useMemo(
    () => (nft && nft.cid ? nft.cid.split("/").pop() : null),
    [nft]
  );

  const imageCid = useMemo(
    () => (metadata && metadata.image ? metadata.image.split("/").pop() : null),
    [metadata]
  );

  useEffect(() => {
    if (metadataCid) handleLoadMetadataWithFallback(metadataCid);
  }, [metadataCid, handleLoadMetadataWithFallback]);

  // Update modal NFT when the original NFT changes (but not during transfers)
  useEffect(() => {
    if (!isTransferModalOpen) {
      setModalNft(nft);
    }
  }, [nft, isTransferModalOpen]);

  // Handle quantity updates from the modal
  const handleQuantityUpdate = useCallback((tokenId: string, newQuantity: number) => {
    setModalNft(prev => ({
      ...prev,
      quantity: newQuantity
    }));
    onQuantityUpdate?.(tokenId, newQuantity);
  }, [onQuantityUpdate]);

  return (
    <>
      <li
        key={nft.id}
        className="flex flex-row items-start gap-6 p-4 rounded-xl shadow-lg border border-white/15 backdrop-filter backdrop-blur-md"
      >
        {metadata?.image ? (
          <Image
            src={metadata.image}
            alt={metadata?.name ?? ""}
            className="w-20 h-24 rounded-lg"
            width={640}
            height={256}
            unoptimized
          />
        ) : (
          <div className="w-20 h-24 rounded-lg bg-gray-800 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{metadata?.name}</h3>
          <p className="text-sm text-gray-400">{metadata?.description}</p>
          <p className="text-sm text-gray-400">Quantity: {nft.quantity}</p>
          {nft.quantity === 0 && (
            <p className="text-sm text-red-400">(No tokens available)</p>
          )}
          <p className="text-sm text-gray-400 break-all">
            Metadata:{" "}
            <Link
              href={getStorageUrl(nft.cid)}
              target="_blank"
            >
              {nft.cid.slice(0, 6)}...{nft.cid.slice(-6)}
            </Link>
          </p>
          {imageCid && (
            <p className="text-sm text-gray-400 break-all">
              Image:{" "}
              <Link
                href={getStorageUrl(imageCid)}
                target="_blank"
              >
                {imageCid.slice(0, 6)}...{imageCid.slice(-6)}
              </Link>
            </p>
          )}
          {metadata && metadata.external_url && (
            <p className="text-sm text-gray-400 break-all">
              External URL:{" "}
              <Link href={metadata.external_url} target="_blank">
                {metadata.external_url}
              </Link>
            </p>
          )}
          
          {showTransferButton && (
            <div className="mt-4">
              <button
                onClick={() => setIsTransferModalOpen(true)}
                disabled={nft.quantity === 0}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-opacity ${
                  nft.quantity === 0
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-[#1E58FC] via-[#D914E4] to-[#F10419] hover:opacity-90"
                }`}
              >
                {nft.quantity === 0 ? "No Tokens Available" : "Transfer"}
              </button>
            </div>
          )}
        </div>
      </li>

      {showTransferButton && (
        <TransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          nft={{
            id: modalNft.id,
            tokenId: modalNft.tokenId || "0",
            name: metadata?.name || `NFT ${modalNft.id}`,
            quantity: modalNft.quantity,
            cid: modalNft.cid,
            image: metadata?.image || ""
          }}
          onQuantityUpdate={handleQuantityUpdate}
        />
      )}
    </>
  );
};
