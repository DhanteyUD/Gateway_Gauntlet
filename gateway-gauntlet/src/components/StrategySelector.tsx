"use client";

import React from "react";
import { GameStrategy } from "@/types/game";
import {
  Zap,
  Shield,
  DollarSign,
  TrendingUp,
  Send,
  Crown,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  Lightbulb,
} from "lucide-react";

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
  const getStrategyConfig = (strategy: GameStrategy) => {
    const baseConfig = {
      safe: {
        icon: Shield,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/30",
        gradient: "from-green-400/20 to-green-600/10",
        label: "High Reliability",
      },
      balanced: {
        icon: Scale,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/30",
        gradient: "from-blue-400/20 to-blue-600/10",
        label: "Optimal Balance",
      },
      fast: {
        icon: Zap,
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/30",
        gradient: "from-red-400/20 to-red-600/10",
        label: "Maximum Speed",
      },
      cheap: {
        icon: DollarSign,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        borderColor: "border-yellow-400/30",
        gradient: "from-yellow-400/20 to-yellow-600/10",
        label: "Cost Efficient",
      },
    };

    return (
      baseConfig[strategy.id as keyof typeof baseConfig] || baseConfig.balanced
    );
  };

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case "low":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
          icon: CheckCircle2,
        };
      case "medium":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
          icon: TrendingUp,
        };
      case "high":
        return {
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
          icon: AlertTriangle,
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-400/10",
          borderColor: "border-gray-400/30",
          icon: AlertTriangle,
        };
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#e5ff4a]/10 rounded-xl flex items-center justify-center">
          <Crown className="w-5 h-5 text-[#e5ff4a]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Transaction Strategies
          </h2>
          <p className="text-sm text-gray-400">Choose your Gateway approach</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((strategy) => {
          const strategyConfig = getStrategyConfig(strategy);
          const riskConfig = getRiskConfig(strategy.risk);
          const StrategyIcon = strategyConfig.icon;
          const RiskIcon = riskConfig.icon;

          return (
            <button
              key={strategy.id}
              onClick={() => onStrategySelect(strategy.id)}
              disabled={isSending}
              className={`
                relative p-4 rounded-xl border backdrop-blur-sm text-left
                bg-linear-to-br ${strategyConfig.gradient}
                ${strategyConfig.borderColor}
                hover:shadow-2xl hover:shadow-[#e5ff4a]/10 hover:scale-102 
                transition-all duration-300 transform cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                group overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 ${strategyConfig.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <StrategyIcon
                      className={`w-4 h-4 ${strategyConfig.color}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white group-hover:text-[#e5ff4a] transition-colors">
                      {strategy.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {strategyConfig.label}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${riskConfig.bgColor} ${riskConfig.borderColor} border`}
                >
                  <RiskIcon className={`w-3 h-3 ${riskConfig.color}`} />
                  <span
                    className={`text-[10px] font-semibold ${riskConfig.color}`}
                  >
                    {strategy.risk.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-gray-300 mb-4 leading-relaxed relative z-10">
                {strategy.description}
              </p>

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">
                      {strategy.cost} SOL
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-semibold text-blue-400 capitalize">
                      {strategy.gatewayOptions.strategy}
                    </span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Send className="w-4 h-4 text-[#e5ff4a]" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isSending && (
        <div className="mt-6 p-4 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#e5ff4a] rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-[#e5ff4a] rounded-full animate-ping animation-delay-150"></div>
              <div className="w-2 h-2 bg-[#e5ff4a] rounded-full animate-ping animation-delay-300"></div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-[#e5ff4a] font-medium">
                Processing Transaction...
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">
            Using Sanctum Gateway for optimal delivery
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-black/30 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-[#e5ff4a]" />
          <span className="text-sm font-medium text-[#e5ff4a]">Pro Tip</span>
        </div>
        <p className="text-sm text-gray-300">
          Match your strategy to network conditions. Use{" "}
          <span className="text-green-400">Safe</span> in high congestion,
          <span className="text-red-400"> Fast</span> for time-sensitive
          transactions, and
          <span className="text-yellow-400"> Cheap</span> when the network is
          calm.
        </p>
      </div>
    </div>
  );
};
