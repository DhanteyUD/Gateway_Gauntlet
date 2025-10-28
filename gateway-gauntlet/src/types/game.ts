export interface GameStrategy {
  id: string;
  name: string;
  description: string;
  gatewayOptions: {
    strategy: "jito" | "rpc" | "hybrid" | "sanctum";
    jitoTip?: number;
    useRelay?: boolean;
    rpcWeights?: number[];
  };
  risk: "low" | "medium" | "high";
  cost: number;
}

export interface NetworkCondition {
  congestion: "low" | "medium" | "high" | "extreme";
  successRate: number;
  averageLatency: number;
  description: string;
}

export interface TransactionResult {
  success: boolean;
  signature?: string;
  cost: number;
  latency: number;
  strategyUsed: string;
  error?: string;
}

export interface GameState {
  score: number;
  transactionsAttempted: number;
  transactionsSuccessful: number;
  totalCost: number;
  currentLevel: number;
  isPlaying: boolean;
}
