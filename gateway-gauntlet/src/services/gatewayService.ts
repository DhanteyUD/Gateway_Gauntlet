import {
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  const win = window as Window & { Buffer?: typeof Buffer };
  if (!win.Buffer) {
    win.Buffer = Buffer;
  }
}

const GATEWAY_PROXY_ENDPOINT = "/api/gateway";
const SANCTUM_GATEWAY_API_KEY = process.env.NEXT_PUBLIC_SANCTUM_GATEWAY_API_KEY;

interface NetworkCondition {
  successRate: number;
  congestion: "low" | "medium" | "high" | "extreme";
}

interface BuildTransactionOptions {
  strategy?: "jito" | "rpc" | "hybrid" | "sanctum";
  jitoTip?: number;
  useRelay?: boolean;
  cuPriceRange?: "low" | "medium" | "high";
  jitoTipRange?: "low" | "medium" | "high" | "max";
  skipSimulation?: boolean;
  deliveryMethodType?: "rpc" | "jito" | "sanctum-sender" | "helius-sender";
  fromPubkey?: PublicKey;
  toPubkey?: PublicKey;
  lamports?: number;
  [key: string]: string | number | boolean | PublicKey | undefined;
}

function encodeTransactionToBase64(transaction: Transaction): string {
  const serialized = transaction.serialize({ requireAllSignatures: false });
  return Buffer.from(serialized).toString("base64");
}

class GatewayService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(clusterApiUrl("devnet"));
  }

  async buildGatewayTransaction(options: BuildTransactionOptions = {}) {
    try {
      if (!options.fromPubkey) {
        throw new Error("fromPubkey is required for real transactions");
      }

      const fromPubkey = options.fromPubkey;
      const toPubkey =
        options.toPubkey ||
        (process.env.NEXT_PUBLIC_GATEWAY_HOST_ADDRESS
          ? new PublicKey(process.env.NEXT_PUBLIC_GATEWAY_HOST_ADDRESS)
          : new PublicKey("11111111111111111111111111111112"));

      const lamports = options.lamports || 1000;

      console.log("🔧 Creating unsigned transaction with:", {
        from: fromPubkey.toString(),
        to: toPubkey.toString(),
        strategy: options.strategy,
        lamports,
      });

      const { blockhash, lastValidBlockHeight } =
        await this.connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const encodedTransaction = encodeTransactionToBase64(transaction);

      console.log("📦 Gateway params:");
      console.log("📦 Transaction details:", {
        blockhash: blockhash.slice(0, 8) + "...",
        lastValidBlockHeight,
        from: fromPubkey.toString().slice(0, 8) + "...",
        to: toPubkey.toString().slice(0, 8) + "...",
        lamports,
      });
      const gatewayParams: Record<string, string | boolean> = {
        encoding: "base64",
      };

      if (options.skipSimulation === true) {
        gatewayParams.skipSimulation = true;
      }

      if (options.strategy) {
        const deliveryMethodMap: Record<string, string> = {
          jito: "jito",
          rpc: "rpc",
          sanctum: "sanctum-sender",
          hybrid: "rpc",
        };

        const deliveryMethod = deliveryMethodMap[options.strategy];
        if (deliveryMethod) {
          gatewayParams.deliveryMethodType = deliveryMethod;
        }
      }

      if (options.jitoTipRange) {
        gatewayParams.jitoTipRange = options.jitoTipRange;
      }

      if (options.cuPriceRange) {
        gatewayParams.cuPriceRange = options.cuPriceRange;
      }

      console.log("📦 Sending to Gateway:", gatewayParams);

      const buildGatewayTransactionResponse = await fetch(
        GATEWAY_PROXY_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SANCTUM_GATEWAY_API_KEY}`,
          },
          body: JSON.stringify({
            id: "gateway-gauntlet",
            jsonrpc: "2.0",
            method: "buildGatewayTransaction",
            params: [encodedTransaction, gatewayParams],
          }),
        }
      );

      if (!buildGatewayTransactionResponse.ok) {
        const errorText = await buildGatewayTransactionResponse.text();
        console.log("❌ Gateway build HTTP error:", {
          status: buildGatewayTransactionResponse.status,
          error: errorText,
        });
        throw new Error(
          `Gateway build failed: ${buildGatewayTransactionResponse.status} - ${errorText}`
        );
      }

      const response = await buildGatewayTransactionResponse.json();

      if (response.error) {
        console.log("❌ Gateway build error:", response.error);
        throw new Error(
          `Gateway error: ${response.error.message} (code: ${response.error.code})`
        );
      }

      console.log("✅ Gateway transaction built successfully");
      return {
        transaction: response.result.transaction,
        latestBlockhash: response.result.latestBlockhash,
        _realGateway: true,
        _simulated: false,
      };
    } catch (error) {
      console.log("❌ Error building gateway transaction:", error);
      throw error;
    }
  }

  async sendTransaction(encodedTransaction: string) {
    try {
      console.log("🚀 Sending signed transaction via Gateway...");

      const sendTransactionResponse = await fetch(GATEWAY_PROXY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "gateway-gauntlet",
          jsonrpc: "2.0",
          method: "sendTransaction",
          params: [
            encodedTransaction,
            {
              encoding: "base64",
              skipPreflight: false,
            },
          ],
        }),
      });

      if (!sendTransactionResponse.ok) {
        const errorText = await sendTransactionResponse.text();
        console.log("❌ Gateway send HTTP error:", {
          status: sendTransactionResponse.status,
          error: errorText,
        });
        throw new Error(
          `Gateway send failed: ${sendTransactionResponse.status} - ${errorText}`
        );
      }

      const response = await sendTransactionResponse.json();

      if (response.error) {
        console.log("❌ Gateway send error:", response.error);
        throw new Error(
          `Gateway error: ${response.error.message} (code: ${response.error.code})`
        );
      }

      console.log("✅ Transaction sent via Gateway:", response.result);
      return response.result;
    } catch (error) {
      console.log("❌ Error sending transaction:", error);
      throw error;
    }
  }

  private async simulateGatewayCall(strategy: string): Promise<{
    transaction: string;
    latestBlockhash: {
      blockhash: string;
      lastValidBlockHeight: string;
    };
    _simulated: boolean;
    _successRate: number;
  }> {
    const successRates = {
      safe: 92,
      balanced: 85,
      fast: 75,
      cheap: 88,
      hybrid: 87,
      jito: 78,
      rpc: 82,
      sanctum: 90,
    };

    const successRate =
      successRates[strategy as keyof typeof successRates] || 80;

    return {
      transaction: `simulated_${strategy}_${Date.now()}`,
      latestBlockhash: {
        blockhash: "simulated_" + Math.random().toString(36).substr(2, 9),
        lastValidBlockHeight: Math.floor(Math.random() * 1000).toString(),
      },
      _simulated: true,
      _successRate: successRate,
    };
  }

  async simulateGameTransaction(
    strategy: string,
    networkCondition: NetworkCondition
  ) {
    try {
      const gatewayBaseRates: Record<string, number> = {
        safe: 85,
        balanced: 70,
        fast: 50,
        cheap: 65,
      };

      const gatewayNetworkMultipliers: Record<string, number> = {
        low: 0.95,
        medium: 0.8,
        high: 0.6,
        extreme: 0.4,
      };

      const baseRate = gatewayBaseRates[strategy] || 65;
      const multiplier =
        gatewayNetworkMultipliers[networkCondition.congestion] || 0.7;
      const gatewaySuccessRate = Math.max(10, baseRate * multiplier);

      console.log(`🔗 Gateway success rate: ${gatewaySuccessRate.toFixed(1)}%`);

      const gatewayResponds = Math.random() > 0.2;

      if (!gatewayResponds) {
        console.log("🔗 Gateway API timeout - treating as failure");
        throw new Error("Gateway API timeout");
      }

      const gatewaySuccess = Math.random() * 100 < gatewaySuccessRate;
      let realGatewayUsed = Math.random() > 0.8;

      let signature;
      let realTransactionAttempted = false;

      if (realGatewayUsed) {
        try {
          const buildResult = await this.buildGatewayTransaction({
            strategy:
              strategy === "safe"
                ? "sanctum"
                : strategy === "fast"
                ? "jito"
                : strategy === "cheap"
                ? "rpc"
                : "hybrid",
          });

          if ("_realGateway" in buildResult && buildResult._realGateway) {
            realTransactionAttempted = true;
            const sendResult = await this.sendTransaction(
              buildResult.transaction
            );
            signature = sendResult.signature;
            console.log("🔗 Real Gateway transaction attempted");
          }
        } catch (error) {
          console.log("🔗 Real Gateway failed", error);
          realGatewayUsed = false;
        }
      }

      if (!signature) {
        signature = gatewaySuccess
          ? `gateway_sim_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 6)}`
          : undefined;
      }

      return {
        success: gatewaySuccess,
        cost: this.getEstimatedCost(strategy),
        latency: this.getLatency(strategy) * (1 + (Math.random() - 0.5) * 0.4),
        strategyUsed: strategy,
        signature,
        _realGateway: realGatewayUsed,
        _networkCondition: networkCondition.congestion,
        _gatewaySuccessRate: gatewaySuccessRate,
        _gatewayResponded: gatewayResponds,
        _realTransactionAttempted: realTransactionAttempted,
      };
    } catch (error) {
      console.log("🔗 Gateway simulation error:", error);

      return {
        success: Math.random() > 0.8,
        cost: this.getEstimatedCost(strategy),
        latency: this.getLatency(strategy) * 3,
        strategyUsed: strategy,
        signature: undefined,
        _realGateway: false,
        _networkCondition: networkCondition.congestion,
        _gatewayError: true,
      };
    }
  }

  private basicSimulation(
    strategy: string,
    networkCondition: NetworkCondition
  ) {
    const strategySuccessRates = {
      safe: 90,
      balanced: 80,
      fast: 70,
      cheap: 85,
    };

    const baseSuccessRate =
      strategySuccessRates[strategy as keyof typeof strategySuccessRates] || 80;
    const adjustedSuccessRate =
      baseSuccessRate * (networkCondition.successRate / 100);
    const success = Math.random() * 100 < adjustedSuccessRate;

    return {
      success,
      cost: this.getEstimatedCost(strategy),
      latency: this.getLatency(strategy),
      strategyUsed: strategy,
      signature: success
        ? `simulated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        : undefined,
      _realGateway: false,
      _networkCondition: networkCondition.congestion,
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
