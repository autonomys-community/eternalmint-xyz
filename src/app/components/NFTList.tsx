import Image from 'next/image';

export default function NFTList() {
  // Mock data
  const nfts = [
    {
      id: 1,
      image: "/path/to/image1.jpg",
      name: "NFT One",
      description: "This is the first NFT.",
      quantity: 10,
    },
    {
      id: 2,
      image: "/path/to/image2.jpg",
      name: "NFT Two",
      description: "This is the second NFT.",
      quantity: 5,
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Latest NFTs</h2>
      <ul className="space-y-4">
        {nfts.map((nft) => (
          <li key={nft.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md">
            <Image src={nft.image} alt={nft.name} className="w-16 h-16 rounded-lg" />
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
}
