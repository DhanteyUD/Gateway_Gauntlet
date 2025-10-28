"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { GameState, TransactionResult, NetworkCondition } from "@/types/game";
import {
  GAME_STRATEGIES,
  NETWORK_CONDITIONS,
  SCORING_RULES,
} from "@/constants/gameConfig";
import { GameDashboard } from "./GameDashboard";
import { StrategySelector } from "./StrategySelector";
import { NetworkMonitor } from "./NetworkMonitor";
import { TransactionFeed } from "./TransactionFeed";
import { gameService } from "@/services/gameService";
import {
  Zap,
  Shield,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Play,
  Target,
  BarChart3,
  Send,
} from "lucide-react";

interface GameProps {
  playWithoutWallet?: boolean;
}

export const Game: React.FC<GameProps> = ({ playWithoutWallet = false }) => {
  const { connected, publicKey } = useWallet();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    transactionsAttempted: 0,
    transactionsSuccessful: 0,
    totalCost: 0,
    currentLevel: 1,
    isPlaying: false,
  });
  const [currentCondition, setCurrentCondition] = useState<NetworkCondition>(
    NETWORK_CONDITIONS[0]
  );
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionResult[]
  >([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    setGameState((prev) => ({ ...prev, isPlaying: true }));
    const interval = setInterval(() => {
      const randomCondition =
        NETWORK_CONDITIONS[
          Math.floor(Math.random() * NETWORK_CONDITIONS.length)
        ];
      setCurrentCondition(randomCondition);
    }, 30000);

    return () => clearInterval(interval);
  };

  const sendTransaction = async (strategyId: string) => {
    if (isSending) return;

    setIsSending(true);

    try {
      const result = await gameService.sendGameTransaction(
        strategyId,
        currentCondition
      );

      setGameState((prev) => ({
        ...prev,
        transactionsAttempted: prev.transactionsAttempted + 1,
        transactionsSuccessful:
          prev.transactionsSuccessful + (result.success ? 1 : 0),
        totalCost: prev.totalCost + result.cost,
        score: prev.score + calculateScore(result, result.success),
      }));

      setTransactionHistory((prev) => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Transaction failed:", error);
      const failedResult: TransactionResult = {
        success: false,
        cost: 0.0001,
        latency: 0,
        strategyUsed: strategyId,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      setTransactionHistory((prev) => [failedResult, ...prev.slice(0, 9)]);
    } finally {
      setIsSending(false);
    }
  };

  const calculateScore = (result: TransactionResult, success: boolean) => {
    let score = 0;
    if (success) {
      score += SCORING_RULES.SUCCESS_BONUS;
      score += (1 / result.cost) * SCORING_RULES.COST_EFFICIENCY_MULTIPLIER;
      score += Math.max(0, SCORING_RULES.SPEED_BONUS - result.latency / 100);
    }
    return score * SCORING_RULES.LEVEL_MULTIPLIER * gameState.currentLevel;
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      transactionsAttempted: 0,
      transactionsSuccessful: 0,
      totalCost: 0,
      currentLevel: 1,
      isPlaying: true,
    });
    setTransactionHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#1b1718] text-white p-8">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#e5ff4a]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e5ff4a]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#e5ff4a]/7 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl backdrop-blur-sm">
                <Target className="w-6 h-6 text-[#e5ff4a]" />
                <span className="text-[#e5ff4a] text-sm font-semibold">
                  Sanctum Hackathon 2024
                </span>
              </div>

              <h1 className="text-6xl font-black mb-4 tracking-tight">
                <span className="bg-linear-to-r from-[#e5ff4a] via-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent animate-gradient">
                  GATEWAY
                </span>
                <br />
                <span className="bg-linear-to-r from-[#ffd700] via-[#e5ff4a] to-[#e5ff4a] bg-clip-text text-transparent animate-gradient">
                  GAUNTLET
                </span>
              </h1>

              <div className="flex items-center justify-center gap-4 text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#e5ff4a]" />
                  <span>Live Simulation</span>
                </div>
                <div className="w-1 h-1 bg-[#e5ff4a] rounded-full"></div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#e5ff4a]" />
                  <span>Real-time Analytics</span>
                </div>
              </div>

              {connected && publicKey && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">
                    Connected: {publicKey.toString().slice(0, 4)}...
                    {publicKey.toString().slice(-4)}
                  </span>
                </div>
              )}
              {playWithoutWallet && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e5ff4a]/20 border border-[#e5ff4a]/40 rounded-xl">
                  <div className="w-2 h-2 bg-[#e5ff4a] rounded-full animate-pulse"></div>
                  <span className="text-[#e5ff4a] text-sm">
                    Demo Mode - Connect wallet for full experience
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              {connected ? (
                <WalletMultiButton className="!bg-[#e5ff4a] !text-[#1b1718] !font-bold !px-6 !py-3 !rounded-xl hover:!bg-[#ffd700] transition-all duration-300 transform hover:scale-105" />
              ) : (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 text-[#e5ff4a] rounded-xl hover:bg-[#e5ff4a]/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Game
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5">
              <GameDashboard gameState={gameState} />
            </div>

            <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5">
              <NetworkMonitor condition={currentCondition} />
            </div>

            <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5">
              <StrategySelector
                strategies={GAME_STRATEGIES}
                onStrategySelect={sendTransaction}
                isSending={isSending}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5 h-full">
              <TransactionFeed transactions={transactionHistory} />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-[#e5ff4a]" />
            <h3 className="text-xl font-bold text-[#e5ff4a]">
              How to Master the Gauntlet
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#e5ff4a]/20 transition-colors">
                <Shield className="w-8 h-8 text-[#e5ff4a]" />
              </div>
              <p className="font-semibold mb-2 text-[#e5ff4a]">
                Choose Strategy
              </p>
              <p className="text-sm text-gray-300">
                Select from 4 Gateway delivery methods
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#e5ff4a]/20 transition-colors">
                <TrendingUp className="w-8 h-8 text-[#e5ff4a]" />
              </div>
              <p className="font-semibold mb-2 text-[#e5ff4a]">Read Network</p>
              <p className="text-sm text-gray-300">
                Monitor real-time congestion levels
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#e5ff4a]/20 transition-colors">
                <Send className="w-8 h-8 text-[#e5ff4a]" />
              </div>
              <p className="font-semibold mb-2 text-[#e5ff4a]">
                Send Transaction
              </p>
              <p className="text-sm text-gray-300">
                Execute your chosen strategy
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#e5ff4a]/20 transition-colors">
                <Zap className="w-8 h-8 text-[#e5ff4a]" />
              </div>
              <p className="font-semibold mb-2 text-[#e5ff4a]">
                Optimize & Score
              </p>
              <p className="text-sm text-gray-300">
                Learn and improve your approach
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-[#e5ff4a]" />
            <h3 className="text-xl font-bold text-[#e5ff4a]">
              Gateway Strategies
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#e5ff4a]/5 border border-[#e5ff4a]/20 rounded-xl">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-bold text-green-400 mb-1">Safe</p>
              <p className="text-xs text-gray-300">
                High reliability, moderate cost
              </p>
            </div>
            <div className="text-center p-4 bg-[#e5ff4a]/5 border border-[#e5ff4a]/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="font-bold text-blue-400 mb-1">Balanced</p>
              <p className="text-xs text-gray-300">Best of both worlds</p>
            </div>
            <div className="text-center p-4 bg-[#e5ff4a]/5 border border-[#e5ff4a]/20 rounded-xl">
              <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="font-bold text-orange-400 mb-1">Fast</p>
              <p className="text-xs text-gray-300">
                Maximum speed, higher cost
              </p>
            </div>
            <div className="text-center p-4 bg-[#e5ff4a]/5 border border-[#e5ff4a]/20 rounded-xl">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="font-bold text-yellow-400 mb-1">Cheap</p>
              <p className="text-xs text-gray-300">Lowest cost, slower speed</p>
            </div>
          </div>
        </div>

        {connected && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-400 text-center flex-1">
                🎉 Wallet connected! Ready for real Gateway transactions with
                your API key.
              </p>
            </div>
          </div>
        )}

        {playWithoutWallet && (
          <div className="mt-4 p-4 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#e5ff4a] rounded-full animate-pulse"></div>
              <p className="text-[#e5ff4a] text-center flex-1">
                💡 Experience Gateway strategies in action. Connect your wallet
                for the full power of Sanctum Gateway!
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
};
