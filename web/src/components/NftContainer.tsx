"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Metadata, NFT } from "../types";

export const NftContainer: React.FC<{ nft: NFT }> = ({ nft }) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const handleLoadMetadata = async (cid: string) => {
    try {
      const res = await fetch(`/api/cid/taurus/${cid}`);
      const data = await res.json();
      setMetadata(data);
    } catch (error) {
      console.error("Error loading metadata", error);
    }
  };

  const imageCid = useMemo(
    () => (metadata && metadata.image ? metadata.image.split("/").pop() : null),
    [metadata]
  );

  useEffect(() => {
    handleLoadMetadata(nft.cid);
  }, [nft.cid]);

  return (
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
      <div>
        <h3 className="text-xl font-semibold">{metadata?.name}</h3>
        <p className="text-sm text-gray-400">{metadata?.description}</p>
        <p className="text-sm text-gray-400">Quantity: {nft.quantity}</p>
        <p className="text-sm text-gray-400 break-all">
          Metadata:{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_PERMANENT_STORAGE_URL}/${nft.cid}`}
            target="_blank"
          >
            {nft.cid.slice(0, 6)}...{nft.cid.slice(-6)}
          </Link>
        </p>
        {imageCid && (
          <p className="text-sm text-gray-400 break-all">
            Image:{" "}
            <Link
              href={`${process.env.NEXT_PUBLIC_PERMANENT_STORAGE_URL}/${imageCid}`}
              target="_blank"
            >
              {imageCid.slice(0, 6)}...{imageCid.slice(-6)}
            </Link>
          </p>
        )}
      </div>
    </li>
  );
};
