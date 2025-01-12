"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Metadata, NFT } from "../types";

export const NftContainer: React.FC<{ nft: NFT }> = ({ nft }) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const handleLoadMetadata = async (cid: string) => {
    const res = await fetch(`/api/cid/taurus/${cid}`);
    const data = await res.json();
    console.log("metadata", data);
    setMetadata(data);
  };

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
        <p className="text-sm text-gray-400">CID: {nft.cid}</p>
      </div>
    </li>
  );
};
