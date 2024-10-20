import { Header } from "./components/Header";
import { CreateNFTForm } from "./components/CreateNFTForm";
import { LatestNFTList } from "./components/LatestNFTList";
import { Footer } from "./components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gray-900 text-white">
      <Header />
      <div className="text-center mb-8">
        <Image
          src="/logo.svg"
          alt="Eternal Mint Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold">Eternal Mint</h1>
        <p className="text-lg mt-2">
          Mint Once, Own Forever: Fully Decentralized, Eternally Accessible
          NFTs.
        </p>
      </div>
      <CreateNFTForm />
      <LatestNFTList />
      <Footer />
    </div>
  );
}
