import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LatestNFTList } from "@/components/LatestNFTList";

export default function BrowsePage() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 text-white">
      <Header />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Browse NFTs</h1>
      </div>
      <LatestNFTList />
      <Footer />
    </div>
  );
}
