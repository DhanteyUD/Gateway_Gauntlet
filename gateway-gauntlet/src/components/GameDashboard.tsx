"use client";

import React from "react";
import { GameState } from "@/types/game";
import { Trophy, Target, Send, Coins, Zap, TrendingUp } from "lucide-react";

interface GameDashboardProps {
  gameState: GameState;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ gameState }) => {
  const successRate =
    gameState.transactionsAttempted > 0
      ? (gameState.transactionsSuccessful / gameState.transactionsAttempted) *
        100
      : 0;

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

  const progressPercentage = Math.min(100, (gameState.score % 1000) / 10);

  return (
    <div className="bg-linear-to-br from-black/60 to-[#1b1718]/80 backdrop-blur-xl border border-[#e5ff4a]/30 rounded-3xl p-6 shadow-2xl shadow-[#e5ff4a]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-[#e5ff4a] to-[#ffd700] rounded-2xl flex items-center justify-center">
          <Trophy className="w-5 h-5 text-[#1b1718]" />
        </div>
        <div>
          <h2 className="text-2xl font-black bg-linear-to-r from-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent">
            Game Dashboard
          </h2>
          <p className="text-gray-400 text-sm">Real-time performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#e5ff4a]" />
            <span className="text-gray-400 text-sm font-semibold">SCORE</span>
          </div>
          <div
            className="text-2xl font-black text-[#e5ff4a] truncate"
            title={new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 4,
            }).format(gameState.score)}
          >
            {formatScore(gameState.score)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Total points</div>
        </div>

        <div className="bg-black/40 rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm font-semibold">
              SUCCESS RATE
            </span>
          </div>
          <div className="text-2xl font-black text-blue-400">
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(successRate)}
            %
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {gameState.transactionsSuccessful}/{gameState.transactionsAttempted}{" "}
            successful
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm font-semibold">
              TRANSACTIONS
            </span>
          </div>
          <div className="text-2xl font-black text-green-400">
            {new Intl.NumberFormat("en-US").format(
              gameState.transactionsAttempted
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">Total attempts</div>
        </div>

        <div className="bg-black/40 rounded-2xl p-4 border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm font-semibold">
              SOL SPENT
            </span>
          </div>
          <div className="text-2xl font-black text-yellow-400">
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            }).format(gameState.totalCost)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Total cost</div>
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
            <span className="text-[#e5ff4a] font-bold">
              {gameState.currentLevel}
            </span>{" "}
            • Next:{" "}
            <span className="text-[#e5ff4a] font-bold">
              {Math.ceil(gameState.score / 1000)}
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div
            className="bg-linear-to-r from-[#e5ff4a] to-[#ffd700] h-3 rounded-full transition-all duration-500 ease-out shadow-lg shadow-[#e5ff4a]/30"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Level {gameState.currentLevel}</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(progressPercentage)}
            % to next level
          </span>
          <span>Level {gameState.currentLevel + 1}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {new Intl.NumberFormat("en-US").format(
              gameState.transactionsSuccessful
            )}
          </div>
          <div className="text-xs text-gray-400">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">
            {new Intl.NumberFormat("en-US").format(
              gameState.transactionsAttempted - gameState.transactionsSuccessful
            )}
          </div>
          <div className="text-xs text-gray-400">Losses</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">
            {gameState.transactionsAttempted > 0
              ? new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                }).format(gameState.totalCost / gameState.transactionsAttempted)
              : 0}
          </div>
          <div className="text-xs text-gray-400">Avg Cost</div>
        </div>
      </div>
    </div>
  );
};
