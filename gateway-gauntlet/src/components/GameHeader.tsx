"use client";

import React from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Coins } from "lucide-react";

interface GameHeaderProps {
  playWithoutWallet: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  playWithoutWallet,
}) => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const solBalance = await connection.getBalance(publicKey);
          setBalance(solBalance / 1_000_000_000);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    if (connected && publicKey) {
      fetchBalance();
    }
  }, [connected, publicKey, connection]);

  return (
    <header className="text-center mb-8 relative">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold bg-linear-to-r from-sanctum-primary to-sanctum-secondary bg-clip-text text-transparent">
            Gateway Gauntlet
          </h1>
          <p className="text-gray-400 mt-2">
            Master Solana transaction delivery with Sanctum Gateway
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-3">
          {connected ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Balance Display */}
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-3 border border-[#e5ff4a]/20">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#e5ff4a]" />
                  <span className="text-gray-400 text-sm">Balance:</span>
                  <span className="text-white font-bold">
                    {balance.toFixed(4)} SOL
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {publicKey?.toString().slice(0, 4)}...
                  {publicKey?.toString().slice(-4)}
                </div>
              </div>

              <WalletMultiButton className="bg-red-500/20! text-red-400! font-bold! px-4! py-2! rounded-xl! hover:bg-red-500/30! transition-all duration-300 border border-red-500/30 hover:border-red-500/50" />
            </div>
          ) : (
            <WalletMultiButton className="bg-[#e5ff4a]! text-[#1b1718]! font-bold! px-6! py-3! rounded-xl! hover:bg-[#ffd700]! transition-all duration-300 transform hover:scale-105" />
          )}
        </div>
      </div>

      {/* Status Messages */}
      {connected && publicKey && (
        <p className="text-sm text-green-400 mt-1">
          Connected: {publicKey.toString().slice(0, 8)}...
          {publicKey.toString().slice(-8)}
        </p>
      )}
      {playWithoutWallet && (
        <p className="text-sm text-yellow-400 mt-1">
          🎮 Playing in demo mode - Connect wallet for full Gateway experience
        </p>
      )}
    </header>
  );
};
