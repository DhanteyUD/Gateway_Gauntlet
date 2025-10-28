import React from "react";
import { GameStrategy } from "@/types/game";

interface StrategySelectorProps {
  strategies: GameStrategy[];
  onStrategySelect: (strategyId: string) => void;
  isSending: boolean;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({
  strategies,
  onStrategySelect,
  isSending,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Choose Your Strategy</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onStrategySelect(strategy.id)}
            disabled={isSending}
            className="bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-sanctum-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{strategy.name}</h3>
              <span
                className={`text-sm font-semibold ${getRiskColor(
                  strategy.risk
                )}`}
              >
                {strategy.risk.toUpperCase()} RISK
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-yellow-400">Cost: {strategy.cost} SOL</span>
              <span className="text-blue-400">
                Gateway: {strategy.gatewayOptions.strategy}
              </span>
            </div>
          </button>
        ))}
      </div>

      {isSending && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-sanctum-primary"></div>
          <span className="ml-2 text-gray-400">Sending transaction...</span>
        </div>
      )}
    </div>
  );
};
