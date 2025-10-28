import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

export const metadata = {
  title: "Gateway Gauntlet - Sanctum Hackathon",
  description: "Master Solana transaction delivery with Sanctum Gateway",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
