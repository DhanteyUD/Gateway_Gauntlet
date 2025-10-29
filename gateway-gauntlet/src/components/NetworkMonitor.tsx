"use client";

import React from "react";
import { NetworkCondition } from "@/types/game";

interface NetworkMonitorProps {
  condition: NetworkCondition;
}

export const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  condition,
}) => {
  const getCongestionColor = (congestion: string) => {
    switch (congestion) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "extreme":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Network Conditions</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Congestion:</span>
          <span
            className={`font-bold ${getCongestionColor(condition.congestion)}`}
          >
            {condition.congestion.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Success Rate:</span>
          <span className="font-bold text-blue-400">
            {condition.successRate}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Avg Latency:</span>
          <span className="font-bold text-purple-400">
            {condition.averageLatency}ms
          </span>
        </div>

        <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
          <p className="text-sm text-gray-300">{condition.description}</p>
        </div>
      </div>
    </div>
  );
};
