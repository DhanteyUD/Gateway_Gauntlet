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

      const successProbability = this.calculateRealSuccessProbability(
        strategyId,
        networkCondition
      );

      console.log(
        `📊 Calculated success probability: ${successProbability.toFixed(1)}%`
      );

      const shouldUseRealGateway = !!publicKey && Math.random() > 0.7;

      let gatewayResult;
      let realGatewayUsed = false;

      if (shouldUseRealGateway) {
        console.log("🔗 Attempting real Gateway API...");
        try {
          gatewayResult = await gatewayService.simulateGameTransaction(
            strategyId,
            networkCondition
          );
          realGatewayUsed = gatewayResult._realGateway || false;
          console.log(
            `🔗 Gateway result: ${
              gatewayResult.success ? "✅ Success" : "❌ Failed"
            }`
          );
        } catch (gatewayError) {
          console.error("Gateway error:", gatewayError);
        }
      }

      let finalSuccess: boolean;

      if (gatewayResult) {
        finalSuccess = gatewayResult.success;
      } else {
        const randomRoll = Math.random() * 100;
        finalSuccess = randomRoll < successProbability;

        console.log(
          `🎲 Probability roll: ${randomRoll.toFixed(
            1
          )} < ${successProbability.toFixed(1)} = ${
            finalSuccess ? "✅ Success" : "❌ Failed"
          }`
        );
      }

      const baseCost = this.getStrategyCost(strategyId);
      const finalCost = finalSuccess ? baseCost : baseCost * 0.3;

      const baseLatency = this.getStrategyLatency(strategyId);
      const networkLatencyMultiplier = this.getNetworkLatencyMultiplier(
        networkCondition.congestion
      );
      const variance = 0.8 + Math.random() * 0.4;
      const finalLatency = baseLatency * networkLatencyMultiplier * variance;

      const signature = finalSuccess
        ? realGatewayUsed
          ? `gateway_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
          : `simulated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        : undefined;

      const result = {
        success: finalSuccess,
        cost: finalCost,
        latency: Math.round(finalLatency),
        strategyUsed: strategyId,
        signature,
        realGateway: realGatewayUsed,
        networkCondition: networkCondition.congestion,
        _successProbability: successProbability,
        _randomRoll: gatewayResult ? undefined : Math.random() * 100,
      };

      console.log(
        `📊 Final result: ${finalSuccess ? "✅ SUCCESS" : "❌ FAILED"}`,
        {
          strategy: strategyId,
          network: networkCondition.congestion,
          probability: `${successProbability.toFixed(1)}%`,
          cost: `${finalCost.toFixed(6)} SOL`,
          latency: `${Math.round(finalLatency)}ms`,
          gatewayUsed: realGatewayUsed,
        }
      );

      return result;
    } catch (error) {
      console.error("Game service error:", error);
      return this.createErrorResult(strategyId, networkCondition, error);
    }
  }

  private calculateRealSuccessProbability(
    strategyId: string,
    networkCondition: NetworkCondition
  ): number {
    const baseRates: Record<string, number> = {
      safe: 90,
      balanced: 75,
      fast: 60,
      cheap: 80,
    };

    const networkMultipliers: Record<string, number> = {
      low: 0.95,
      medium: 0.75,
      high: 0.5,
      extreme: 0.3,
    };

    const baseRate = baseRates[strategyId] || 70;
    const multiplier = networkMultipliers[networkCondition.congestion] || 0.7;

    return Math.max(5, Math.min(95, baseRate * multiplier));
  }

  private getNetworkLatencyMultiplier(congestion: string): number {
    const multipliers: Record<string, number> = {
      low: 1.0,
      medium: 2.0,
      high: 4.0,
      extreme: 8.0,
    };
    return multipliers[congestion] || 2.0;
  }

  private createErrorResult(
    strategyId: string,
    networkCondition: NetworkCondition,
    error: unknown
  ) {
    return {
      success: false,
      cost: this.getStrategyCost(strategyId) * 0.5,
      latency: 0,
      strategyUsed: strategyId,
      error: error instanceof Error ? error.message : "Transaction failed",
      realGateway: false,
      networkCondition: networkCondition.congestion,
      _error: true,
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
    return this.calculateRealSuccessProbability(strategyId, networkCondition);
  }
}

export const gameService = new GameService();
