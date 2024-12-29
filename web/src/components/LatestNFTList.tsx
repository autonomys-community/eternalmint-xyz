"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NftMinted = {
  id: string;
  tokenId: number;
  creator: string;
  supply: number;
  blockNumber: number;
  blockTimestamp: number;
};

type NFT = {
  id: string;
  image: string;
  name: string;
  description: string;
  creator: string;
  quantity: number;
};

export const LatestNFTList: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_API!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              nftMinteds(first: 10, orderBy: blockTimestamp) {
                id
                tokenId
                creator
                supply
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
        image: `https://images.pexels.com/photos/${item.tokenId}/pexels-photo-${item.tokenId}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        name: `NFT ${item.tokenId}`,
        description: `Created by ${item.creator}`,
        quantity: item.supply,
      }));
      setNfts(transformedNfts);
    };

    fetchNFTs();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Latest NFTs Created</h2>
      <ul className="space-y-4">
        {nfts.map((nft) => (
          <li
            key={nft.id}
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md"
          >
            <Image
              src={nft.image}
              alt={nft.name}
              className="w-16 h-16 rounded-lg"
              width={640}
              height={256}
              unoptimized
            />
            <div>
              <h3 className="text-xl font-semibold">{nft.name}</h3>
              <p className="text-sm text-gray-400">{nft.description}</p>
              <p className="text-sm text-gray-400">Quantity: {nft.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
