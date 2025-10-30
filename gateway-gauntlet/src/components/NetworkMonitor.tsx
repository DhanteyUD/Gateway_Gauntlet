"use client";

import React from "react";
import { NetworkCondition } from "@/types/game";
import { Wifi, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface NetworkMonitorProps {
  condition: NetworkCondition;
}

export const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  condition,
}) => {
  const getCongestionConfig = (congestion: string) => {
    switch (congestion) {
      case "low":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
          icon: "🟢",
          label: "Optimal",
        };
      case "medium":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
          icon: "🟡",
          label: "Moderate",
        };
      case "high":
        return {
          color: "text-orange-400",
          bgColor: "bg-orange-400/10",
          borderColor: "border-orange-400/30",
          icon: "🟠",
          label: "High",
        };
      case "extreme":
        return {
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
          icon: "🔴",
          label: "Extreme",
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-400/10",
          borderColor: "border-gray-400/30",
          icon: "⚪",
          label: "Unknown",
        };
    }
  };

  const config = getCongestionConfig(condition.congestion);

  return (
    <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 shadow-2xl shadow-[#e5ff4a]/5 hover:border-[#e5ff4a]/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#e5ff4a]/10 rounded-xl flex items-center justify-center">
          <Wifi className="w-5 h-5 text-[#e5ff4a]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Network Status</h2>
          <p className="text-sm text-gray-400">Live Solana conditions</p>
        </div>
      </div>

      <div
        className={`${config.bgColor} ${config.borderColor} rounded-xl p-4 mb-6 border backdrop-blur-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{config.icon}</div>
            <div>
              <p className="text-sm text-gray-300">Congestion</p>
              <p className={`text-lg font-bold ${config.color}`}>
                {config.label}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Level</p>
            <p className={`text-sm font-semibold ${config.color}`}>
              {condition.congestion.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-3 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-medium">
              Success Rate
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-400">
              {condition.successRate}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${condition.successRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-3 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400 font-medium">
              Avg Latency
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-400">
              {condition.averageLatency}
            </span>
            <span className="text-sm text-gray-400">ms</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {condition.averageLatency < 300
              ? "Fast"
              : condition.averageLatency < 800
              ? "Normal"
              : "Slow"}
          </div>
        </div>
      </div>

      <div className="bg-[#e5ff4a]/5 border border-[#e5ff4a]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#e5ff4a] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#e5ff4a] mb-1">
              Network Advisory
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {condition.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 justify-end">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-400">Live updates every 30s</span>
      </div>
    </div>
  );
};
