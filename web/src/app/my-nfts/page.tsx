"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MyNFTsList } from "@/components/MyNFTsList";

export default function MyNFTsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      <main className="min-h-screen p-4 pb-12 sm:px-40 text-white">
        <Header />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">My Eternal NFTs</h1>
            <p className="text-xl text-gray-300">
              View all the Eternal NFTs you own
            </p>
          </div>
          
          <MyNFTsList />
        </div>
      </main>
      <Footer />
    </div>
  );
} 