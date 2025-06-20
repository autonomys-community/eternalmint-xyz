import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LatestNFTList } from "@/components/LatestNFTList";

export default function BrowsePage() {
  return (
    <div className="min-h-screen p-4 pb-12 sm:px-40 text-white">
      <Header />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Browse NFTs</h1>
      </div>
      <LatestNFTList />
      <Footer />
    </div>
  );
}
