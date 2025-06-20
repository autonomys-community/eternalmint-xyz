"use client";

import { getStorageUrl } from "@/config/constants";
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
      const res = await fetch(`/api/cid/taurus/${cid}`);
      const metadata = await res.json();
      console.log("metadata", metadata);
      return {
        ...metadata,
        image: metadata.image
          .replace("http://localhost:[0-9]+", process.env.NEXT_PUBLIC_HOST)
          .replace("//api", "/api"),
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
        console.log("metadata", metadata);
        setMetadata(metadata);
      } catch (error) {
        console.error("Error loading metadata", error);
        await new Promise((resolve) => setTimeout(resolve, 500));
        try {
          const metadata = await handleLoadMetadata(cid);
          console.log("metadata", metadata);
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
        <Image
          src={metadata?.image ?? ""}
          alt={metadata?.name ?? ""}
          className="w-20 h-24 rounded-lg"
          width={640}
          height={256}
          unoptimized
        />
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
