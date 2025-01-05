"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { Routes } from "../constants/routes";
export const Header: React.FC = () => {
  const pathname = usePathname();

  const font = "font-manrope font-extrabold";
  const hover =
    "text-white hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent";
  const active =
    "bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent";

  const activeOrHoverClass = useCallback(
    (route: Routes) => `${font} ${pathname === route ? active : hover}`,
    [pathname]
  );

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <Image
          src="/images/EternalMint-LogoWithText.png"
          alt="Eternal Mint - Logo with text"
          width={255}
          height={60}
        />
      </div>
      <nav className="flex gap-6 items-center">
        <Link href={Routes.HOME} className={activeOrHoverClass(Routes.HOME)}>
          Home
        </Link>
        <Link
          href={Routes.CREATE}
          className={activeOrHoverClass(Routes.CREATE)}
        >
          Create Eternal NFTs
        </Link>
        <Link
          href={Routes.BROWSE}
          className={activeOrHoverClass(Routes.BROWSE)}
        >
          Browse NFTs
        </Link>
        <ConnectButton />
      </nav>
    </header>
  );
};
