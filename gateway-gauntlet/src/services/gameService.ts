import { PublicKey } from "@solana/web3.js";
import { gatewayService } from "./gatewayService";
import { NetworkCondition } from "@/types/game";

export class GameService {
  async sendGameTransaction(
    strategyId: string,
    networkCondition: NetworkCondition,
    fromPubkey?: PublicKey
  ) {
    try {
      console.log(
        `🎮 Sending game transaction: ${strategyId} in ${
          networkCondition.congestion
        } conditions, from ${fromPubkey?.toString() || "unknown"}`
      );

      const result = await gatewayService.simulateGameTransaction(
        strategyId,
        networkCondition,
        fromPubkey
      );

      return {
        success: result.success,
        cost: result.cost * (result.success ? 1 : 0.3),
        latency: result.latency * (0.8 + Math.random() * 0.4),
        strategyUsed: strategyId,
        signature: result.signature,
        realGateway: result._realGateway,
        networkCondition: result._networkCondition,
        error: result.success ? undefined : "Transaction failed",
        fromAddress: fromPubkey?.toString(),
      };
    } catch (error) {
      console.error("Game service error:", error);
      return {
        success: false,
        cost: 0.0001,
        latency: 0,
        strategyUsed: strategyId,
        signature: undefined,
        realGateway: false,
        networkCondition: networkCondition.congestion,
        fromAddress: fromPubkey?.toString(),
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const gameService = new GameService();
