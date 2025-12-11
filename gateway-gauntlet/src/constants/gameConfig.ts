import { GameStrategy, NetworkCondition } from "@/types/game";

export const GAME_STRATEGIES: GameStrategy[] = [
  {
    id: "safe",
    name: "Safe Sender",
    description: "Uses Sanctum Sender for maximum reliability",
    gatewayOptions: {
      strategy: "sanctum",
      jitoTipRange: "low",
      cuPriceRange: "medium",
      skipSimulation: true,
    },
    risk: "low",
    cost: 0.0001,
  },
  {
    id: "balanced",
    name: "Balanced Approach",
    description: "Jito + RPC fallback for good speed and cost savings",
    gatewayOptions: {
      strategy: "hybrid",
      jitoTipRange: "medium",
      cuPriceRange: "medium",
      skipSimulation: true,
    },
    risk: "medium",
    cost: 0.0002,
  },
  {
    id: "fast",
    name: "Speed Demon",
    description: "Jito bundles only for maximum speed",
    gatewayOptions: {
      strategy: "jito",
      jitoTipRange: "high",
      cuPriceRange: "high",
      skipSimulation: true,
    },
    risk: "high",
    cost: 0.0005,
  },
  {
    id: "cheap",
    name: "Cost Saver",
    description: "RPC only with multiple endpoints",
    gatewayOptions: {
      strategy: "rpc",
      jitoTipRange: "low",
      cuPriceRange: "low",
      skipSimulation: true,
    },
    risk: "medium",
    cost: 0.00005,
  },
];

export const NETWORK_CONDITIONS: NetworkCondition[] = [
  {
    congestion: "low",
    successRate: 85,
    averageLatency: 200,
    description: "Network is calm. Most transactions should succeed.",
  },
  {
    congestion: "medium",
    successRate: 65,
    averageLatency: 500,
    description: "Moderate traffic. Many transactions may fail.",
  },
  {
    congestion: "high",
    successRate: 40,
    averageLatency: 1200,
    description: "High congestion! Expect frequent failures.",
  },
  {
    congestion: "extreme",
    successRate: 20,
    averageLatency: 3000,
    description: "Network storm! Most transactions will fail.",
  },
];

export const SCORING_RULES = {
  SUCCESS_BONUS: 50,
  COST_EFFICIENCY_MULTIPLIER: 1000,
  SPEED_BONUS: 25,
  LEVEL_MULTIPLIER: 1.2,
  REAL_GATEWAY_BONUS: 10,
  MAX_COST_EFFICIENCY: 1000,
  MAX_SCORE_PER_TRANSACTION: 100,
  REAL_TRANSACTION_BONUS: 200,
};
