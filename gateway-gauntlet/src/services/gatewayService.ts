import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";

export const GATEWAY_ENDPOINT = `https://tpg.sanctum.so/v1/${
  process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
}?apiKey=${process.env.NEXT_PUBLIC_GATEWAY_API_KEY}`;

function getBase64EncodedWireTransaction(
  transaction: Transaction | VersionedTransaction
): string {
  const serialized = transaction.serialize();
  return Buffer.from(serialized).toString("base64");
}

function getTransactionFromBase64(
  encodedTransaction: string
): VersionedTransaction {
  const transactionBuffer = Buffer.from(encodedTransaction, "base64");
  return VersionedTransaction.deserialize(transactionBuffer);
}

class GatewayService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"));
  }

  async buildGatewayTransaction(
    transaction: Transaction | VersionedTransaction,
    options: {
      encoding?: "base64" | "base58";
      skipSimulation?: boolean;
      skipPriorityFee?: boolean;
      cuPriceRange?: "low" | "medium" | "high";
      jitoTipRange?: "low" | "medium" | "high" | "max";
      expireInSlots?: number;
      deliveryMethodType?: "rpc" | "jito" | "sanctum-sender" | "helius-sender";
    } = {}
  ) {
    try {
      const encodedTransaction = getBase64EncodedWireTransaction(transaction);

      const buildGatewayTransactionResponse = await fetch(GATEWAY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "gateway-gauntlet",
          jsonrpc: "2.0",
          method: "buildGatewayTransaction",
          params: [
            encodedTransaction,
            {
              encoding: "base64",
              skipSimulation: true, // Skip for game simulation
              ...options,
            },
          ],
        }),
      });

      if (!buildGatewayTransactionResponse.ok) {
        throw new Error("Failed to build gateway transaction");
      }

      const { result } = (await buildGatewayTransactionResponse.json()) as {
        result: {
          transaction: string;
          latestBlockhash: {
            blockhash: string;
            lastValidBlockHeight: string;
          };
        };
      };

      return {
        transaction: getTransactionFromBase64(result.transaction),
        latestBlockhash: result.latestBlockhash,
      };
    } catch (error) {
      console.error("Error building gateway transaction:", error);
      throw error;
    }
  }

  async sendTransaction(transaction: Transaction | VersionedTransaction) {
    try {
      const encodedTransaction = getBase64EncodedWireTransaction(transaction);

      const sendTransactionResponse = await fetch(GATEWAY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "gateway-gauntlet",
          jsonrpc: "2.0",
          method: "sendTransaction",
          params: [encodedTransaction],
        }),
      });

      if (!sendTransactionResponse.ok) {
        throw new Error("Failed to send transaction");
      }

      const data = await sendTransactionResponse.json();
      return data.result;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  async simulateTransaction(
    transaction: Transaction | VersionedTransaction,
    strategy: string
  ) {
    const baseSuccessRate = 80;

    const strategyModifiers: Record<string, number> = {
      safe: 15,
      balanced: 0,
      fast: -10,
      cheap: -5,
    };

    const successRate = Math.max(
      10,
      Math.min(95, baseSuccessRate + (strategyModifiers[strategy] || 0))
    );
    const success = Math.random() * 100 < successRate;

    return {
      successRate,
      estimatedCost: this.getEstimatedCost(strategy),
      latency: this.getLatency(strategy),
      strategy,
      success,
    };
  }

  private getEstimatedCost(strategy: string): number {
    const costs: Record<string, number> = {
      safe: 0.0001,
      balanced: 0.0002,
      fast: 0.0005,
      cheap: 0.00005,
    };
    return costs[strategy] || 0.0001;
  }

  private getLatency(strategy: string): number {
    const latencies: Record<string, number> = {
      safe: 300,
      balanced: 200,
      fast: 100,
      cheap: 500,
    };
    return latencies[strategy] || 200;
  }
}

export const gatewayService = new GatewayService();
