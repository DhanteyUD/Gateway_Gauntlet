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

      // Update game state with the result
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
    <div className="min-h-screen bg-sanctum-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-5xl font-bold bg-linear-to-r from-sanctum-primary to-sanctum-secondary bg-clip-text text-transparent">
                Gateway Gauntlet
              </h1>
              <p className="text-gray-400 mt-2">
                Master Solana transaction delivery with Sanctum Gateway
              </p>
              {connected && publicKey && (
                <p className="text-sm text-green-400 mt-1">
                  Connected: {publicKey.toString().slice(0, 4)}...
                  {publicKey.toString().slice(-4)}
                </p>
              )}
              {playWithoutWallet && (
                <p className="text-sm text-yellow-400 mt-1">
                  🎮 Playing in demo mode - Connect wallet for full Gateway
                  experience
                </p>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              {connected ? (
                <WalletMultiButton />
              ) : (
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  🔄 Reset Game
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Game Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <GameDashboard gameState={gameState} />
            <NetworkMonitor condition={currentCondition} />
            <StrategySelector
              strategies={GAME_STRATEGIES}
              onStrategySelect={sendTransaction}
              isSending={isSending}
            />
          </div>

          <div className="lg:col-span-1">
            <TransactionFeed transactions={transactionHistory} />
          </div>
        </div>

        {/* Game Instructions */}
        <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold mb-3 text-sanctum-primary">
            How to Play
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="font-semibold mb-1">🎯 Objective</p>
              <p>
                Maximize your score by sending successful transactions with
                optimal cost and speed.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">⚡ Strategies</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="text-green-400">Safe</span>: High success
                  rate, moderate cost
                </li>
                <li>
                  <span className="text-blue-400">Balanced</span>: Good balance
                  of speed and cost
                </li>
                <li>
                  <span className="text-orange-400">Fast</span>: Maximum speed,
                  higher cost
                </li>
                <li>
                  <span className="text-yellow-400">Cheap</span>: Lowest cost,
                  slower speed
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gateway Benefits */}
        {connected && (
          <div className="mt-8 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-400 text-center">
              🎉 Wallet connected! Ready for real Gateway transactions when you
              get your API key.
            </p>
          </div>
        )}

        {/* Demo Mode Info */}
        {playWithoutWallet && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-blue-400 text-center">
              💡 This is a simulation demonstrating Gateway strategies. Connect
              your wallet to experience real Gateway transactions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
