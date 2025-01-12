import { CreateNFTForm } from "../components/CreateNFTForm";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { LatestNFTList } from "../components/LatestNFTList";

export default function Home() {
  return (
    <div className="min-h-screen p-4 pb-12 sm:px-40 text-white">
      <Header />
      <CreateNFTForm />
      <LatestNFTList />
      <Footer />
    </div>
  );
}
