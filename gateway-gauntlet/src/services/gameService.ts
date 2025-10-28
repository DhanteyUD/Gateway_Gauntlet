import { gatewayService } from "./gatewayService";
import { NetworkCondition } from '@/types/game';

export class GameService {
  async sendGameTransaction(
    strategyId: string,
    networkCondition: NetworkCondition
  ) {
    const simulation = await gatewayService.simulateTransaction(
      {} as unknown as import("@solana/web3.js").Transaction,
      strategyId
    );

    const adjustedSuccessRate =
      simulation.successRate * (networkCondition.successRate / 100);
    const success = Math.random() * 100 < adjustedSuccessRate;

    return {
      success,
      cost: simulation.estimatedCost * (success ? 1 : 0.5),
      latency: simulation.latency * (0.8 + Math.random() * 0.4),
      strategyUsed: strategyId,
      signature: success
        ? `simulated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        : undefined,
    };
  }
}

export const gameService = new GameService();
