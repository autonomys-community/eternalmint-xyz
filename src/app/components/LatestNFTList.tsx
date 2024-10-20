import Image from 'next/image';

export const LatestNFTList: React.FC = () => {
  // Mock data

  const mockImage = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
  const nfts = [
    {
      id: 1,
      image: mockImage(1103970),
      name: "NFT One",
      description: "This is the first NFT.",
      quantity: 10,
    },
    {
      id: 2,
      image: mockImage(416430),
      name: "NFT Two",
      description: "This is the second NFT.",
      quantity: 5,
    },
    {
      id: 3,
      image: mockImage(123458),
      name: "NFT Three",
      description: "This is the third NFT.",
      quantity: 8,
    },
    {
      id: 4,
      image: mockImage(234567),
      name: "NFT Four",
      description: "This is the fourth NFT.",
      quantity: 12,
    },
    {
      id: 5,
      image: mockImage(1738986),
      name: "NFT Five",
      description: "This is the fifth NFT.",
      quantity: 7,
    },
    {
      id: 6,
      image: mockImage(911738),
      name: "NFT Six",
      description: "This is the sixth NFT.",
      quantity: 15,
    },
    {
      id: 7,
      image: mockImage(567890),
      name: "NFT Seven",
      description: "This is the seventh NFT.",
      quantity: 3,
    },
    {
      id: 8,
      image: mockImage(227675),
      name: "NFT Eight",
      description: "This is the eighth NFT.",
      quantity: 20,
    },
    {
      id: 9,
      image: mockImage(789012),
      name: "NFT Nine",
      description: "This is the ninth NFT.",
      quantity: 6,
    },
    {
      id: 10,
      image: mockImage(358574),
      name: "NFT Ten",
      description: "This is the tenth NFT.",
      quantity: 4,
    },
    {
      id: 11,
      image: mockImage(325185),
      name: "NFT Eleven",
      description: "This is the eleventh NFT.",
      quantity: 9,
    },
    {
      id: 12,
      image: mockImage(1012345),
      name: "NFT Twelve",
      description: "This is the twelfth NFT.",
      quantity: 11,
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Latest NFTs Created</h2>
      <ul className="space-y-4">
        {nfts.map((nft) => (
          <li key={nft.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md">
            <Image src={nft.image} alt={nft.name} className="w-16 h-16 rounded-lg" width={640} height={256} unoptimized />
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
