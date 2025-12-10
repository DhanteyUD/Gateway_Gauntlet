import { PublicKey } from "@solana/web3.js";
import { gatewayService } from "./gatewayService";
import { NetworkCondition } from "@/types/game";

export class GameService {
  async sendGameTransaction(
    strategyId: string,
    networkCondition: NetworkCondition,
    publicKey?: PublicKey
  ) {
    try {
      console.log(
        `🎮 Executing ${strategyId} strategy in ${networkCondition.congestion} conditions`
      );

      const strategySuccessRates = {
        safe: 90,
        balanced: 75,
        fast: 60,
        cheap: 80,
      };

      const baseSuccessRate =
        strategySuccessRates[strategyId as keyof typeof strategySuccessRates] ||
        70;

      const networkMultipliers = {
        low: 1.0,
        medium: 0.8,
        high: 0.6,
        extreme: 0.4,
      };

      const networkMultiplier =
        networkMultipliers[networkCondition.congestion] || 0.7;
      const adjustedSuccessRate = baseSuccessRate * networkMultiplier;

      const shouldUseRealGateway = !!publicKey && Math.random() > 0.3;

      let result;
      let realGatewayUsed = false;

      if (shouldUseRealGateway) {
        console.log("🔗 Using real Gateway API...");

        try {
          const gatewayResult = await gatewayService.simulateGameTransaction(
            strategyId,
            networkCondition
          );
          realGatewayUsed = gatewayResult._realGateway || false;

          const gatewaySuccess = gatewayResult.success || false;
          const finalSuccess =
            Math.random() * 100 <
            adjustedSuccessRate * (gatewaySuccess ? 1.1 : 0.9);

          result = {
            success: finalSuccess,
            cost: gatewayResult.cost,
            latency: gatewayResult.latency * (1 + Math.random() * 0.5),
            strategyUsed: strategyId,
            signature: gatewayResult.signature,
            realGateway: realGatewayUsed,
            networkCondition: networkCondition.congestion,
          };
        } catch (gatewayError) {
          console.error(
            "Gateway error, falling back to simulation:",
            gatewayError
          );
          result = this.createSimulatedResult(
            strategyId,
            adjustedSuccessRate,
            networkCondition
          );
        }
      } else {
        console.log("🎮 Using simulation...");
        result = this.createSimulatedResult(
          strategyId,
          adjustedSuccessRate,
          networkCondition
        );
      }

      const baseLatency = this.getStrategyLatency(strategyId);
      const networkLatencyMultipliers = {
        low: 1.0,
        medium: 1.5,
        high: 2.5,
        extreme: 4.0,
      };

      const latencyMultiplier =
        networkLatencyMultipliers[networkCondition.congestion] || 1.5;
      result.latency =
        baseLatency * latencyMultiplier * (0.8 + Math.random() * 0.4);

      console.log(
        `📊 Result: ${
          result.success ? "✅ Success" : "❌ Failed"
        } (${adjustedSuccessRate.toFixed(1)}% chance)`
      );
      return result;
    } catch (error) {
      console.error("Game service error:", error);
      return this.createErrorResult(strategyId, networkCondition, error);
    }
  }

  private createSimulatedResult(
    strategyId: string,
    successRate: number,
    networkCondition: NetworkCondition
  ) {
    const success = Math.random() * 100 < successRate;

    return {
      success,
      cost: this.getStrategyCost(strategyId),
      latency: this.getStrategyLatency(strategyId),
      strategyUsed: strategyId,
      signature: success
        ? `simulated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        : undefined,
      realGateway: false,
      networkCondition: networkCondition.congestion,
    };
  }

  private createErrorResult(
    strategyId: string,
    networkCondition: NetworkCondition,
    error: unknown
  ) {
    return {
      success: false,
      cost: this.getStrategyCost(strategyId),
      latency: 0,
      strategyUsed: strategyId,
      error:
        error instanceof Error
          ? error.message
          : "Transaction simulation failed",
      realGateway: false,
      networkCondition: networkCondition.congestion,
    };
  }

  private getStrategyCost(strategyId: string): number {
    const costs: Record<string, number> = {
      safe: 0.0001,
      balanced: 0.0002,
      fast: 0.0005,
      cheap: 0.00005,
    };
    return costs[strategyId] || 0.0001;
  }

  private getStrategyLatency(strategyId: string): number {
    const latencies: Record<string, number> = {
      safe: 400,
      balanced: 250,
      fast: 150,
      cheap: 600,
    };
    return latencies[strategyId] || 300;
  }

  getStrategyEffectiveness(
    strategyId: string,
    networkCondition: NetworkCondition
  ): number {
    const strategyScores = {
      safe: { low: 90, medium: 85, high: 80, extreme: 75 },
      balanced: { low: 85, medium: 80, high: 75, extreme: 65 },
      fast: { low: 70, medium: 60, high: 50, extreme: 40 },
      cheap: { low: 80, medium: 70, high: 60, extreme: 50 },
    };

    const strategyScore =
      strategyScores[strategyId as keyof typeof strategyScores];
    if (!strategyScore) return 70;

    return strategyScore[networkCondition.congestion] || 70;
  }
}

export const gameService = new GameService();
