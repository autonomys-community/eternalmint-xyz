import { CreateNFTForm } from "@/components/CreateNFTForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function CreatePage() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gray-900 text-white">
      <Header />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Create Eternal NFTs</h1>
      </div>
      <CreateNFTForm />
      <Footer />
    </div>
  );
}
