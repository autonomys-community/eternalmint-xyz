import { CreateNFTForm } from "./components/CreateNFTForm";
import { LatestNFTList } from "./components/LatestNFTList";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gray-900 text-white">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Eternal Mint</h1>
        <p className="text-lg mt-2">Mint Once, Own Forever: Fully Decentralized, Eternally Accessible NFTs.</p>
      </header>
      <CreateNFTForm />
      <LatestNFTList />
    </div>
  );
}
