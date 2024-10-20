import Image from 'next/image';
import { CreateNFTForm } from "./components/CreateNFTForm";
import { LatestNFTList } from "./components/LatestNFTList";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gray-900 text-white">
      <header className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Eternal Mint Logo" width={100} height={100} />
          <h1 className="text-4xl font-bold">Eternal Mint</h1>
        </div>
        <p className="text-lg mt-2 text-center">Mint Once, Own Forever: Fully Decentralized, Eternally Accessible NFTs.</p>
      </header>
      <CreateNFTForm />
      <LatestNFTList />
    </div>
  );
}
