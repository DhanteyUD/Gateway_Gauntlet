"use client";

import React from "react";
import { GameState } from "@/types/game";
import { Target, Send, Zap, TrendingUp, Cpu, Gamepad2 } from "lucide-react";

interface GameDashboardProps {
  gameState: GameState;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ gameState }) => {
  const successRate =
    gameState.transactionsAttempted > 0
      ? (gameState.transactionsSuccessful / gameState.transactionsAttempted) *
        100
      : 0;

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
          <Gamepad2 className="w-5 h-5 text-[#1b1718]" />
        </div>
        <div>
          <h2 className="text-2xl font-black bg-linear-to-r from-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent">
            Game Dashboard
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
          <div className="text-xs text-gray-400 mt-1">Total points</div>
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
          <div className="text-xs text-gray-400 mt-1">
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
          <div className="text-xs text-gray-400 mt-1">Total attempts</div>
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
          <div className="text-xs text-gray-400 mt-1">API calls</div>
        </div>
      </div>

      <div className="bg-black/40 rounded-2xl p-4 border border-[#e5ff4a]/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#e5ff4a]" />
            <span className="text-gray-300 font-semibold">Level Progress</span>
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

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {gameState.transactionsSuccessful}
          </div>
          <div className="text-xs text-gray-400">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">
            {gameState.transactionsAttempted - gameState.transactionsSuccessful}
          </div>
          <div className="text-xs text-gray-400">Losses</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">
            {gameState.totalCost.toFixed(4)}
          </div>
          <div className="text-xs text-gray-400">SOL Spent</div>
        </div>
      </div>
    </div>
  );
};
