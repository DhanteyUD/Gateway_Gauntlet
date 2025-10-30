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
import { ResultModal } from "./ResultModal";
import { gameService } from "@/services/gameService";
import Image from "next/image";
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
  Cpu,
  Rocket,
  Code,
  Server,
  Scale,
} from "lucide-react";

interface GameProps {
  playWithoutWallet?: boolean;
}

const GAME_STATE_KEY = "gateway-gauntlet-game-state";
const TRANSACTION_HISTORY_KEY = "gateway-gauntlet-transaction-history";

export const Game: React.FC<GameProps> = ({ playWithoutWallet = false }) => {
  const { connected, publicKey } = useWallet();

  const [showResultModal, setShowResultModal] = useState(false);
  const [lastResult, setLastResult] = useState<TransactionResult | null>(null);

  const loadGameState = (): GameState => {
    if (typeof window === "undefined") return getInitialGameState();

    try {
      const saved = localStorage.getItem(GAME_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...getInitialGameState(),
          ...parsed,
          totalRealGatewayUsed: parsed.totalRealGatewayUsed || 0,
        };
      }
    } catch (error) {
      console.error("Error loading game state:", error);
    }
    return getInitialGameState();
  };

  const loadTransactionHistory = (): TransactionResult[] => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem(TRANSACTION_HISTORY_KEY);
      if (saved) {
        const transactions = JSON.parse(saved);
        return transactions.map((tx: TransactionResult) => ({
          ...tx,
          timestamp: tx.timestamp || Date.now(),
        }));
      }
    } catch (error) {
      console.error("Error loading transaction history:", error);
    }
    return [];
  };

  const getInitialGameState = (): GameState => ({
    score: 0,
    transactionsAttempted: 0,
    transactionsSuccessful: 0,
    totalCost: 0,
    currentLevel: 1,
    isPlaying: false,
    totalRealGatewayUsed: 0,
  });

  const [gameState, setGameState] = useState<GameState>(loadGameState);
  const [currentCondition, setCurrentCondition] = useState<NetworkCondition>(
    NETWORK_CONDITIONS[0]
  );
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionResult[]
  >(loadTransactionHistory);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        TRANSACTION_HISTORY_KEY,
        JSON.stringify(transactionHistory)
      );
    }
  }, [transactionHistory]);

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

  const calculateLevel = (score: number): number => {
    return Math.floor(score / 1000) + 1;
  };

  const sendTransaction = async (strategyId: string) => {
    if (isSending) return;

    setIsSending(true);

    try {
      if (!publicKey) return;

      const result = await gameService.sendGameTransaction(
        strategyId,
        currentCondition,
        publicKey
      );

      const resultWithTimestamp: TransactionResult = {
        ...result,
        timestamp: Date.now(),
        networkCondition: String(
          result.networkCondition ?? currentCondition.congestion
        ),
      };

      const newScore =
        gameState.score +
        calculateScore(resultWithTimestamp, result.success, result.realGateway);
      const newLevel = calculateLevel(newScore);

      setGameState((prev) => ({
        ...prev,
        transactionsAttempted: prev.transactionsAttempted + 1,
        transactionsSuccessful:
          prev.transactionsSuccessful + (result.success ? 1 : 0),
        totalCost: prev.totalCost + result.cost,
        score: newScore,
        currentLevel: newLevel,
        totalRealGatewayUsed:
          prev.totalRealGatewayUsed + (result.realGateway ? 1 : 0),
      }));

      setTransactionHistory((prev) => [
        resultWithTimestamp,
        ...prev.slice(0, 19),
      ]);

      setLastResult(resultWithTimestamp);
      setShowResultModal(true);
    } catch (error) {
      console.error("Transaction failed:", error);
      const failedResult: TransactionResult = {
        success: false,
        cost: 0.0001,
        latency: 0,
        strategyUsed: strategyId,
        error: error instanceof Error ? error.message : "Unknown error",
        realGateway: false,
        networkCondition: String(currentCondition.congestion),
        timestamp: Date.now(),
      };
      setTransactionHistory((prev) => [failedResult, ...prev.slice(0, 19)]);

      setLastResult(failedResult);
      setShowResultModal(true);
    } finally {
      setIsSending(false);
    }
  };

  const calculateScore = (
    result: TransactionResult,
    success: boolean,
    realGateway?: boolean
  ) => {
    let score = 0;
    if (success) {
      score += SCORING_RULES.SUCCESS_BONUS;

      const costEfficiency = Math.min(
        SCORING_RULES.MAX_COST_EFFICIENCY,
        (0.001 / result.cost) * SCORING_RULES.COST_EFFICIENCY_MULTIPLIER
      );
      score += costEfficiency;

      const speedBonus = Math.max(
        0,
        SCORING_RULES.SPEED_BONUS - result.latency / 50
      );
      score += speedBonus;

      if (realGateway) {
        score += SCORING_RULES.REAL_GATEWAY_BONUS;
      }

      score *= 1 + (gameState.currentLevel - 1) * 0.1;

      score = Math.min(score, SCORING_RULES.MAX_SCORE_PER_TRANSACTION);
    } else {
      score = -5;
    }

    return Math.round(score);
  };

  const resetGame = () => {
    const newState = getInitialGameState();
    setGameState(newState);
    setTransactionHistory([]);
    setShowResultModal(false);
    setLastResult(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem(GAME_STATE_KEY);
      localStorage.removeItem(TRANSACTION_HISTORY_KEY);
    }
  };

  if (!connected && !playWithoutWallet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1b1718] text-white p-8 font-poppins">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#e5ff4a]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e5ff4a]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#e5ff4a]/7 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <div className="relative flex justify-between items-start mb-6">
            <div className="flex-1 text-center mb-2">
              <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl backdrop-blur-sm">
                <span className="text-[#e5ff4a] text-sm font-semibold tracking-wide uppercase">
                  Sanctum
                </span>
                <Image
                  src="https://mintcdn.com/sanctum-8b4c5bf5/aA2NSy1MLgkLh8kE/logo/dark.svg?fit=max&auto=format&n=aA2NSy1MLgkLh8kE&q=85&s=537b4693ba9d11b0543b118bdec9d400"
                  alt="sanctum gateway"
                  width={100}
                  height={100}
                />
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
                  <span>Live Gateway Simulation</span>
                </div>
                <div className="w-1 h-1 bg-[#e5ff4a] rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#e5ff4a]" />
                  <span>Real API Integration</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
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
                      Demo Mode - Connect wallet for full Gateway experience
                    </span>
                  </div>
                )}

                {gameState.totalRealGatewayUsed > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-xl">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm">
                      Real Gateway Used: {gameState.totalRealGatewayUsed}{" "}
                      {gameState.totalRealGatewayUsed <= 1 ? "time" : "times"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute right-0 top-0">
              {connected ? (
                <WalletMultiButton />
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
            <div
              className="h-[800px] lg:h-full lg:min-h-[600px]"
              style={{ maxHeight: "1623px" }}
            >
              <TransactionFeed transactions={transactionHistory} />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-linear-to-br from-black/60 to-[#1b1718]/80 backdrop-blur-xl border border-[#e5ff4a]/30 rounded-3xl p-8 shadow-2xl shadow-[#e5ff4a]/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5ff4a]/5 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#e5ff4a]/3 rounded-full blur-xl -translate-x-8 translate-y-8"></div>

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="relative">
              <div className="w-12 h-12 bg-linear-to-br from-[#e5ff4a] to-[#ffd700] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e5ff4a]/20">
                <Cpu className="w-6 h-6 text-[#1b1718]" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1b1718] animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-2xl font-black bg-linear-to-r from-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent">
                Gateway Integration
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Real-time Sanctum Gateway API Status
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 relative z-10">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Code className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <span className="text-white font-semibold block">
                      buildGatewayTransaction
                    </span>
                    <span className="text-green-400 text-xs">
                      Processing requests
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold text-xs bg-green-500/10 px-3 py-1 rounded-full">
                    ACTIVE
                  </span>
                  <div className="text-gray-500 text-xs mt-1">0ms avg</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Server className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <span className="text-white font-semibold block">
                      sendTransaction
                    </span>
                    <span className="text-green-400 text-xs">
                      Delivering transactions
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold text-xs bg-green-500/10 px-3 py-1 rounded-full">
                    ACTIVE
                  </span>
                  <div className="text-gray-500 text-xs mt-1">0ms avg</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <span className="text-white font-semibold block">
                      API Connection
                    </span>
                    <span className="text-green-400 text-xs">
                      Secure WebSocket
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold text-xs bg-green-500/10 px-3 py-1 rounded-full">
                    LIVE
                  </span>
                  <div className="text-gray-500 text-xs mt-1">100% uptime</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-linear-to-br from-[#e5ff4a]/10 to-[#ffd700]/5 border border-[#e5ff4a]/30 rounded-2xl p-6 h-full backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-lg font-black text-[#e5ff4a]">
                    Features
                  </h4>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: RotateCcw,
                      feature: "Jito + RPC Fallback",
                      desc: "Auto cost optimization",
                    },
                    {
                      icon: Rocket,
                      feature: "Multi-Delivery",
                      desc: "4 delivery methods",
                    },
                    {
                      icon: DollarSign,
                      feature: "Cost Control",
                      desc: "Smart tip management",
                    },
                    {
                      icon: BarChart3,
                      feature: "Live Analytics",
                      desc: "Real-time observability",
                    },
                    {
                      icon: Scale,
                      feature: "Load Balancing",
                      desc: "Auto failover",
                    },
                    {
                      icon: Shield,
                      feature: "Reliability",
                      desc: "99.9% success rate",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 group hover:transform hover:scale-105 transition-all duration-200"
                    >
                      <item.icon className="text-xl" />
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">
                          {item.feature}
                        </div>
                        <div className="text-gray-400 text-xs">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#e5ff4a]/20">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-[#e5ff4a] font-bold text-sm">4</div>
                      <div className="text-gray-400 text-xs">Strategies</div>
                    </div>
                    <div>
                      <div className="text-[#e5ff4a] font-bold text-sm">
                        100%
                      </div>
                      <div className="text-gray-400 text-xs">Real API</div>
                    </div>
                    <div>
                      <div className="text-[#e5ff4a] font-bold text-sm">
                        0ms
                      </div>
                      <div className="text-gray-400 text-xs">Latency</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e5ff4a]/20 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">
                  All systems operational
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                Sanctum Gateway • v2.1.0
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5">
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
                Real Gateway API integration
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

        {connected && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-400 text-center flex-1">
                🎉 Wallet connected! Real Gateway transactions are active
              </p>
            </div>
          </div>
        )}

        {playWithoutWallet && (
          <div className="mt-4 p-4 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#e5ff4a] rounded-full animate-pulse"></div>
              <p className="text-[#e5ff4a] text-center flex-1">
                💡 Gateway integration is active! Transactions use real Sanctum
                Gateway API calls.
              </p>
            </div>
          </div>
        )}
      </div>

      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={lastResult}
        gameState={gameState}
      />

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
