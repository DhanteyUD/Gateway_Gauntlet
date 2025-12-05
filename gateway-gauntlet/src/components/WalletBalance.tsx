"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet, Coins, RefreshCw, ExternalLink } from "lucide-react";
import Image from "next/image";

const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatSOL = (sol: number): string => {
  return sol.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

export const WalletBalance: React.FC = () => {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [balanceInUSD, setBalanceInUSD] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number>(0);

  const fetchBalance = async () => {
    if (!connected || !publicKey) return;

    setLoading(true);
    try {
      const solBalance = await connection.getBalance(publicKey);
      const solBalanceInSOL = solBalance / 1_000_000_000;
      setBalance(solBalanceInSOL);

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
      const price = data.solana.usd;
      setSolPrice(price);
      return price;
    } catch (error) {
      console.error("Error fetching SOL price, using fallback:", error);
      const fallbackPrice = 100;
      setSolPrice(fallbackPrice);
      return fallbackPrice;
    }
  };

  const refreshAllData = async () => {
    await fetchSOLPrice();
    await fetchBalance();
  };

  useEffect(() => {
    if (connected && publicKey) {
      refreshAllData();

      const interval = setInterval(refreshAllData, 30000);
      return () => clearInterval(interval);
    } else {
      setBalance(0);
      setBalanceInUSD(0);
      setSolPrice(0);
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
    <div className="flex flex-col items-center gap-6">
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 min-w-[320px] w-full shadow-xl shadow-[#e5ff4a]/5">
        {/* Wallet Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {walletIcon ? (
              <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center p-2 border border-[#e5ff4a]/10">
                <Image
                  src={walletIcon}
                  alt={walletName}
                  width={24}
                  height={24}
                  className="rounded"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-[#e5ff4a]/10 rounded-xl flex items-center justify-center border border-[#e5ff4a]/20">
                <Wallet className="w-6 h-6 text-[#e5ff4a]" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-xs text-green-400 font-semibold">
                  Connected
                </div>
              </div>
              <div className="text-white font-bold">{walletName}</div>
            </div>
          </div>
          <button
            onClick={refreshAllData}
            disabled={loading}
            className="p-2 bg-[#e5ff4a]/10 hover:bg-[#e5ff4a]/20 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 cursor-pointer group"
            title="Refresh balance"
          >
            <RefreshCw
              className={`w-5 h-5 text-[#e5ff4a] group-hover:rotate-180 transition-transform duration-500 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Balance Display */}
        <div className="space-y-4 mb-4">
          {/* SOL Balance */}
          <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#e5ff4a]" />
                <span className="text-gray-400 text-sm font-medium">
                  SOL Balance
                </span>
              </div>
              <div className="text-xs text-gray-500">
                ${solPrice.toFixed(2)}/SOL
              </div>
            </div>
            {loading ? (
              <div className="h-10 w-40 bg-gray-700 rounded-lg animate-pulse"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {formatSOL(balance)}
                </span>
                <span className="text-lg text-[#e5ff4a] font-semibold">
                  SOL
                </span>
              </div>
            )}
          </div>

          {/* USD Value */}
          <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm font-medium mb-2">
              USD Value
            </div>
            {loading ? (
              <div className="h-8 w-32 bg-gray-700 rounded-lg animate-pulse"></div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  ${formatNumberWithCommas(balanceInUSD)}
                </span>
                <span className="text-xs text-gray-500 ml-1">USD</span>
              </div>
            )}
          </div>
        </div>

        {/* Address and Footer */}
        <div className="pt-4 border-t border-[#e5ff4a]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs">Wallet Address</span>
            <a
              href={`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e5ff4a] hover:text-[#ffd700] transition-colors"
              title="View on Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <a
            href={`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-[#e5ff4a] text-sm transition-colors group bg-black/20 rounded-lg p-3 hover:bg-black/30"
          >
            <div className="flex-1 truncate font-mono text-xs">
              {publicKey?.toString().slice(0, 12)}...
              {publicKey?.toString().slice(-12)}
            </div>
            <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Live Update Indicator */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#e5ff4a]/10">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live updates every 30s</span>
        </div>
      </div>
    </div>
  );
};
