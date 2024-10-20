import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <nav className="flex gap-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/create" className="hover:underline">
          Create Eternal NFTs
        </Link>
        <Link href="/browse" className="hover:underline">Browse NFTs</Link>
      </nav>
      <ConnectButton />
    </header>
  );
};
