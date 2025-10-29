"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LandingPage } from "@/components/LandingPage";
import { Game } from "@/components/Game";

export default function Home() {
  const { connected } = useWallet();
  const [playWithoutWallet, setPlayWithoutWallet] = useState(false);

  const showGame = connected || playWithoutWallet;

  return (
    <main>
      {!showGame ? (
        <LandingPage onPlayWithoutWallet={() => setPlayWithoutWallet(true)} />
      ) : (
        <Game playWithoutWallet={playWithoutWallet} />
      )}
    </main>
  );
}
