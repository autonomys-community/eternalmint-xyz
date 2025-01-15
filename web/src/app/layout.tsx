import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import { Web3Provider } from "../providers/Web3Provider";
import "./globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Eternal Mint",
  description:
    "Mint Once, Own Forever: Fully Decentralized, Eternally Accessible NFTs.",
  keywords: [
    "NFT",
    "Web3",
    "Blockchain",
    "Eternal Mint",
    "Decentralized",
    "Crypto",
    "Token",
    "Permanent",
    "Autonomys",
  ],
  openGraph: {
    title: "Eternal Mint",
    description:
      "Mint Once, Own Forever: Fully Decentralized, Eternally Accessible NFTs.",
    images: ["/share.png"],
    url: "https://eternalmint.xyz",
    siteName: "Eternal Mint",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternal Mint",
    description:
      "Mint Once, Own Forever: Fully Decentralized, Eternally Accessible NFTs.",
    images: ["/share.png"],
    site: "@eternalmint_xyz",
    creator: "@marcaureleb",
  },
  alternates: {
    canonical: "https://eternalmint.xyz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1, // no limit
      "max-image-preview": "large",
      "max-snippet": -1, // no limit
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
      <body
        className={`bg-custom-bg bg-no-repeat bg-cover ${geistSans.variable} ${geistMono.variable} ${manrope.variable} antialiased`}
      >
        <Web3Provider>{children}</Web3Provider>
        <div className="h-[10px] bg-gradient-to-r from-[#1E58FC] via-[#D914E4] to-[#F10419]"></div>
      </body>
    </html>
  );
}
