import React from "react";
import { GameState } from "@/types/game";

interface GameDashboardProps {
  gameState: GameState;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ gameState }) => {
  const successRate =
    gameState.transactionsAttempted > 0
      ? (gameState.transactionsSuccessful / gameState.transactionsAttempted) *
        100
      : 0;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Game Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-sanctum-primary">
            {gameState.score}
          </div>
          <div className="text-gray-400">Score</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">
            {successRate.toFixed(1)}%
          </div>
          <div className="text-gray-400">Success Rate</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">
            {gameState.transactionsAttempted}
          </div>
          <div className="text-gray-400">Transactions</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">
            {gameState.totalCost.toFixed(4)}
          </div>
          <div className="text-gray-400">SOL Spent</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Level {gameState.currentLevel}</span>
          <span>Next level: {Math.ceil(gameState.score / 1000)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-sanctum-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(gameState.score % 1000) / 10}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
