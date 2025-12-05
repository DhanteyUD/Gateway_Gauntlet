"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { LandingPage } from "@/components/LandingPage";
import { Game } from "@/components/Game";
import { useGameState } from "@/hooks/useGameState";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const { connected } = useWallet();
  const { state, isLoading, setPlayWithoutWallet, resetGameState } =
    useGameState();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1b1718] text-white flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="inline-block animate-spin h-12 w-12 text-[#e5ff4a] mb-4" />
          <p className="text-gray-400">Loading your game...</p>
        </div>
      </div>
    );
  }

  const showGame = connected || state.playWithoutWallet;

  return (
    <main>
      {!showGame ? (
        <LandingPage onPlayWithoutWallet={setPlayWithoutWallet} />
      ) : (
        <Game
          playWithoutWallet={state.playWithoutWallet}
          onResetGameState={resetGameState}
        />
      )}
    </main>
  );
}
