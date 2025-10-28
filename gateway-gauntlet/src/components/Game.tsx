"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { GameState, TransactionResult, NetworkCondition } from "@/types/game";
import {
  GAME_STRATEGIES,
  NETWORK_CONDITIONS,
  SCORING_RULES,
} from "@/constants/gameConfig";
import { gatewayService } from "@/services/gatewayService";
import { GameDashboard } from "./GameDashboard";
import { StrategySelector } from "./StrategySelector";
import { NetworkMonitor } from "./NetworkMonitor";
import { TransactionFeed } from "./TransactionFeed";

export const Game: React.FC = () => {
  const { connected, wallet } = useWallet();
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
    if (connected && wallet) {
      gatewayService.setWallet(wallet);
      startGame();
    }
  }, [connected, wallet]);

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
    if (!connected || isSending) return;

    setIsSending(true);
    const strategy = GAME_STRATEGIES.find((s) => s.id === strategyId);
    if (!strategy) return;

    try {
      const transaction = await gatewayService.buildGameTransaction(
        [],
        strategy.gatewayOptions
      );
      const simulation = await gatewayService.simulateTransaction(transaction);

      const success = Math.random() * 100 < currentCondition.successRate;

      const result: TransactionResult = {
        success,
        cost: strategy.cost * (success ? 1 : 0.5),
        latency: simulation.latency * (0.5 + Math.random()),
        strategyUsed: strategy.name,
        signature: success ? `simulated_${Date.now()}` : undefined,
      };

      setGameState((prev) => ({
        ...prev,
        transactionsAttempted: prev.transactionsAttempted + 1,
        transactionsSuccessful: prev.transactionsSuccessful + (success ? 1 : 0),
        totalCost: prev.totalCost + result.cost,
        score: prev.score + calculateScore(result, success),
      }));

      setTransactionHistory((prev) => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Transaction failed:", error);
      const failedResult: TransactionResult = {
        success: false,
        cost: strategy.cost * 0.5,
        latency: 0,
        strategyUsed: strategy.name,
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

  if (!connected) {
    return (
      <div className="min-h-screen bg-sanctum-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Gateway Gauntlet</h1>
          <p className="text-xl text-gray-400">
            Connect your wallet to start playing!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sanctum-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-linear-to-r from-sanctum-primary to-sanctum-secondary bg-clip-text text-transparent">
            Gateway Gauntlet
          </h1>
          <p className="text-gray-400 mt-2">
            Master Solana transaction delivery with Sanctum Gateway
          </p>
        </header>

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
      </div>
    </div>
  );
};
