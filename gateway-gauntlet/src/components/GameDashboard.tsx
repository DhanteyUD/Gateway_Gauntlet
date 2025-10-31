/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { GameState } from "@/types/game";
import {
  Target,
  Send,
  Zap,
  TrendingUp,
  Cpu,
  Swords,
  UserStar,
  Bot,
  Castle
} from "lucide-react";

interface GameDashboardProps {
  gameState: GameState;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ gameState }) => {
  const calculateBalancedPosition = () => {
    if (gameState.transactionsAttempted === 0) return 50;

    const wins = gameState.transactionsSuccessful;
    const total = gameState.transactionsAttempted;

    const smoothingFactor = Math.min(total / 10, 1);
    const rawPercentage = (wins / total) * 100;
    const smoothedPercentage = 50 + (rawPercentage - 50) * smoothingFactor;

    return Math.max(10, Math.min(90, smoothedPercentage));
  };

  const balancedPosition = calculateBalancedPosition();

  const successRate =
    gameState.transactionsAttempted > 0
      ? (gameState.transactionsSuccessful / gameState.transactionsAttempted) *
        100
      : 50;

  const calculateLevel = (score: number): number => {
    return Math.floor(score / 1000) + 1;
  };

  const calculateLevelProgress = (score: number): number => {
    const levelScore = score % 1000;
    return Math.min(100, (levelScore / 1000) * 100);
  };

  const currentLevel = calculateLevel(gameState.score);
  const levelProgress = calculateLevelProgress(gameState.score);
  const nextLevelScore = currentLevel * 1000;

  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 2,
      }).format(score);
    }
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(score);
  };

  return (
    <div className="bg-linear-to-br from-black/60 to-[#1b1718]/80 backdrop-blur-xl border border-[#e5ff4a]/30 rounded-3xl p-6 shadow-2xl shadow-[#e5ff4a]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-[#e5ff4a] to-[#ffd700] rounded-xl flex items-center justify-center">
          <Castle className="w-5 h-5 text-[#1b1718]" />
        </div>
        <div>
          <h2 className="text-2xl font-black bg-linear-to-r from-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent">
            Battle Station
          </h2>
          <p className="text-gray-400 text-sm">Real-time performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 flex flex-col justify-between rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-gray-400 text-xs font-semibold">SCORE</span>
            </div>
            <div
              className="text-2xl font-black text-[#e5ff4a] truncate"
              title={new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 4,
              }).format(gameState.score)}
            >
              {formatScore(gameState.score)}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-5">Total points</div>
        </div>

        <div className="bg-black/40 flex flex-col justify-between rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-xs font-semibold">
                SUCCESS RATE
              </span>
            </div>
            <div className="text-2xl font-black text-blue-400">
              {successRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-5">
            {gameState.transactionsSuccessful}/{gameState.transactionsAttempted}{" "}
            successful
          </div>
        </div>

        <div className="bg-black/40 flex flex-col justify-between rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-xs font-semibold">
                TRANSACTIONS
              </span>
            </div>
            <div className="text-2xl font-black text-green-400">
              {new Intl.NumberFormat("en-US").format(
                gameState.transactionsAttempted
              )}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-5">Total attempts</div>
        </div>

        <div className="bg-black/40 flex flex-col justify-between rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-xs font-semibold">
                REAL GATEWAY
              </span>
            </div>
            <div className="text-2xl font-black text-purple-400">
              {gameState.totalRealGatewayUsed || 0}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-5">API calls</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="bg-black/40 rounded-2xl p-4 border border-[#e5ff4a]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-gray-300 font-semibold">
                Level Progress
              </span>
            </div>

            <div className="text-sm text-gray-400">
              Level{" "}
              <span className="text-[#e5ff4a] font-bold">{currentLevel}</span> •
              Next:{" "}
              <span className="text-[#e5ff4a] font-bold">
                {nextLevelScore} points
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-[#e5ff4a] to-[#ffd700] h-3 rounded-full transition-all duration-500 ease-out shadow-lg shadow-[#e5ff4a]/30"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Level {currentLevel}</span>
            <span>{levelProgress.toFixed(1)}% to next level</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-4 border border-[#e5ff4a]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-gray-300 font-semibold">
                Mission Control
              </span>
            </div>

            <div className="text-xs text-gray-400">
              {balancedPosition >= 70 ? (
                <span className="text-green-400">
                  🔥 "Dominating the battlefield!" - Keep crushing it!
                </span>
              ) : balancedPosition >= 55 ? (
                <span className="text-[#e5ff4a]">
                  💪 "Winning streak active!" - Maintain your edge!
                </span>
              ) : balancedPosition >= 45 ? (
                <span className="text-yellow-400">
                  ⚔️ "Balanced combat!" - Push for victory!
                </span>
              ) : balancedPosition >= 30 ? (
                <span className="text-orange-400">
                  🎯 "Fight back harder!" - Turn the tide!
                </span>
              ) : (
                <span className="text-red-400">
                  🛡️ "Never surrender!" - Comeback starts now!
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="w-full h-8 bg-linear-to-r from-gray-600 via-gray-500 to-gray-600 rounded-lg overflow-hidden relative shadow-inner">
              <div
                className="absolute left-0 top-0 h-full bg-linear-to-r from-green-500 to-green-400 transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${balancedPosition}%` }}
              >
                <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
              </div>

              <div
                className="absolute right-0 top-0 h-full bg-linear-to-l from-red-500 to-red-400 transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${100 - balancedPosition}%` }}
              >
                <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-10 bg-[#e5ff4a] shadow-lg shadow-[#e5ff4a]/50 z-10">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#e5ff4a] rotate-45 shadow-lg shadow-[#e5ff4a]/50"></div>
              </div>

              <div
                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 transition-all duration-500 ease-out z-20 shadow-xl"
                style={{
                  left: `${balancedPosition}%`,
                  borderColor: balancedPosition >= 50 ? "#22c55e" : "#ef4444",
                  transform: `translateX(-50%) translateY(-50%) scale(${
                    1 + Math.abs(balancedPosition - 50) / 100
                  })`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor:
                      balancedPosition >= 50
                        ? "rgb(34 197 94 / 0.5)"
                        : "rgb(239 68 68 / 0.5)",
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                <span className="flex gap-2 items-center text-green-400">
                  <p> PLAYER: {gameState.transactionsSuccessful}</p>
                  <UserStar size={16} />
                </span>
              </div>
              <div className="text-gray-400">
                {gameState.transactionsAttempted === 0
                  ? "⚡ Ready to Battle!"
                  : successRate >= 50
                  ? "🏆 Winning!"
                  : "⚔️ Losing"}
              </div>
              <div className="flex items-center gap-2">
                <span className="flex gap-2 items-center text-red-400">
                  <Bot size={16} />{" "}
                  <p>
                    SYSTEM:{" "}
                    {gameState.transactionsAttempted -
                      gameState.transactionsSuccessful}
                  </p>
                </span>
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {gameState.transactionsSuccessful}
          </div>
          <div className="text-xs text-gray-400">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">
            {gameState.totalCost.toFixed(4)}
          </div>
          <div className="text-xs text-gray-400">SOL Spent</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">
            {gameState.transactionsAttempted - gameState.transactionsSuccessful}
          </div>
          <div className="text-xs text-gray-400">Losses</div>
        </div>
      </div>
    </div>
  );
};
