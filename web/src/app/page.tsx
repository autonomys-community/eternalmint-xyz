import Image from "next/image";
import { CreateNFTForm } from "../components/CreateNFTForm";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { LatestNFTList } from "../components/LatestNFTList";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 text-white">
      <Header />
      <CreateNFTForm />
      <LatestNFTList />
      <Footer />
    </div>
  );
}
