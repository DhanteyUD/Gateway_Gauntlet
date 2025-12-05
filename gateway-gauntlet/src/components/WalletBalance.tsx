"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet, Coins, RefreshCw, ExternalLink } from "lucide-react";
import Image from "next/image";

export const WalletBalance: React.FC = () => {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [balanceInUSD, setBalanceInUSD] = useState<number>(0);

  const fetchBalance = async () => {
    if (!connected || !publicKey) return;

    setLoading(true);
    try {
      const solBalance = await connection.getBalance(publicKey);
      const solBalanceInSOL = solBalance / 1_000_000_000;
      setBalance(solBalanceInSOL);

      const solPrice = await fetchSOLPrice();
      setBalanceInUSD(solBalanceInSOL * solPrice);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
      setBalanceInUSD(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchSOLPrice = async (): Promise<number> => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data = await response.json();
      return data.solana.usd;
    } catch (error) {
      console.error("Error fetching SOL price, using fallback:", error);
      return 100;
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();

      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    } else {
      setBalance(0);
      setBalanceInUSD(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, connection]);

  if (!connected) {
    return (
      <div className="flex items-center gap-4">
        <WalletMultiButton className="bg-[#e5ff4a]! text-[#1b1718]! font-bold! px-6! py-3! rounded-xl! hover:bg-[#ffd700]! transition-all duration-300 transform hover:scale-105" />
      </div>
    );
  }

  const walletName = wallet?.adapter.name || "Wallet";
  const walletIcon = wallet?.adapter.icon;

  return (
    <div className="flex items-center gap-6">
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 min-w-[280px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {walletIcon ? (
              <Image
                src={walletIcon}
                alt={walletName}
                width={50}
                height={50}
              />
            ) : (
              <div className="w-8 h-8 bg-[#e5ff4a]/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-[#e5ff4a]" />
              </div>
            )}
            <div>
              <div className="text-sm text-green-400">Connected</div>
              <div className="text-white font-semibold">{walletName}</div>
            </div>
          </div>
          <button
            onClick={fetchBalance}
            disabled={loading}
            className="p-2 bg-[#e5ff4a]/10 hover:bg-[#e5ff4a]/20 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh balance"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#e5ff4a] ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-gray-400 text-sm">SOL Balance</span>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <div className="text-white font-bold text-lg">
                  {balance.toFixed(4)} SOL
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">USD Value</span>
            {loading ? (
              <div className="h-5 w-16 bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <div className="text-gray-300 font-semibold">
                ${balanceInUSD.toFixed(2)}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#e5ff4a]/20">
            <a
              href={`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-[#e5ff4a] text-sm transition-colors group"
            >
              <span className="truncate max-w-40">
                {publicKey?.toString().slice(0, 8)}...
                {publicKey?.toString().slice(-8)}
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      <WalletMultiButton className="bg-red-500/20! text-red-400! font-bold! px-4! py-2! rounded-xl! hover:bg-red-500/30! transition-all duration-300 border border-red-500/30 hover:border-red-500/50" />
    </div>
  );
};
