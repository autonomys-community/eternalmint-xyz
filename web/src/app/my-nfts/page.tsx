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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-4xl">🃏</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                My NFT Collection
              </h1>
              <div className="text-4xl">🎴</div>
            </div>
            <p className="text-xl text-gray-300">
              Your eternal collectible cards • Trade, transfer, and showcase
            </p>
          </div>
          
          <MyNFTsList />
        </div>
      </main>
      <Footer />
    </div>
  );
} 