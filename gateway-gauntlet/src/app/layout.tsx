import { Poppins } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Gateway Gauntlet - Sanctum Hackathon",
  description: "Master Solana transaction delivery with Sanctum Gateway",
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  manifest: '/manifest.json',
  themeColor: '#e5ff4a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gateway Gauntlet',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
