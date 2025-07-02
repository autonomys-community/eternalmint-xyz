"use client";

import { APP_CONFIG } from "@/config/app";
import { useEffect, useState } from "react";
import { NFT, NftMinted } from "../types";
import { NftContainer } from "./NftContainer";

export const LatestNFTList: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const response = await fetch(APP_CONFIG.contract.subgraphUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              nftMinteds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
                id
                tokenId
                creator
                supply
                cid
                blockNumber
                blockTimestamp
              }
            }
          `,
        }),
      });
      const { data } = await response.json();
      console.log("data", data);
      const transformedNfts = data.nftMinteds.map((item: NftMinted) => ({
        id: item.id,
        image: "",
        name: "",
        description: "",
        quantity: item.supply,
        cid: item.cid,
      }));
      setNfts(transformedNfts);
    };

    fetchNFTs();
  }, []);

  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Latest NFTs Created</h2>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {nfts.map((nft) => (
          <NftContainer key={nft.id} nft={nft} />
        ))}
      </ul>
    </div>
  );
};
