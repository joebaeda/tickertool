import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContextProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ticker Tool | Create ERC20 Tokens with built-in AMM",
    description: "Deploy ERC20 Tokens with built-in AMM features in just a few clicks without any coding skills required.",
  openGraph: {
    title: "Ticker Tool | Create ERC20 Tokens with built-in AMM",
    description: "Deploy ERC20 Tokens with built-in AMM features in just a few clicks without any coding skills required.",
    url: "https://tool.tickerswap.xyz",
    images: [
      {
        url: "https://tool.tickerswap.xyz/og-image.jpg",
        width: 1200,
        height: 600,
        alt: "Ticker Tool",
      },
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ticker Tool | Create ERC20 Tokens with built-in AMM",
    description: "Deploy ERC20 Tokens with built-in AMM features in just a few clicks without any coding skills required.",
    images: ["https://tool.tickerswap.xyz/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: "/favicon.ico"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
