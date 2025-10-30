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

interface NetworkCondition {
  successRate: number;
  congestion?: string | number;
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
      const fromPubkey =
        options.fromPubkey || new PublicKey("11111111111111111111111111111111");

      const toPubkey = process.env.NEXT_PUBLIC_GATEWAY_HOST_ADDRESS
        ? new PublicKey(process.env.NEXT_PUBLIC_GATEWAY_HOST_ADDRESS)
        : new PublicKey("11111111111111111111111111111112");

      console.log("🔧 Creating transaction with:", {
        from: fromPubkey.toString(),
        to: toPubkey.toString(),
        strategy: options.strategy,
      });

      const { blockhash, lastValidBlockHeight } =
        await this.connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: 1000,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const encodedTransaction = encodeTransactionToBase64(transaction);

      console.log("🔧 Building Gateway transaction with options:", options);
      console.log("📦 Transaction details:", {
        blockhash: blockhash.slice(0, 8) + "...",
        lastValidBlockHeight,
        from: fromPubkey.toString().slice(0, 8) + "...",
        to: toPubkey.toString().slice(0, 8) + "...",
        lamports: 1000,
      });

      const gatewayParams: Record<string, string | boolean> = {
        encoding: "base64",
      };

      if (options.skipSimulation !== undefined) {
        gatewayParams.skipSimulation = options.skipSimulation;
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

      if (options.deliveryMethodType) {
        gatewayParams.deliveryMethodType = options.deliveryMethodType;
      }

      console.log("📦 Gateway params being sent:", gatewayParams);

      const buildGatewayTransactionResponse = await fetch(
        GATEWAY_PROXY_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        console.error("❌ Gateway build HTTP error:", {
          status: buildGatewayTransactionResponse.status,
          error: errorText,
        });
        throw new Error(
          `Gateway build failed: ${buildGatewayTransactionResponse.status}`
        );
      }

      const response = await buildGatewayTransactionResponse.json();

      if (response.error) {
        console.error("Gateway build error details:", response.error);
        throw new Error(
          `Gateway error: ${response.error.message} (code: ${response.error.code})`
        );
      }

      console.log("✅ Gateway transaction built successfully");
      return {
        transaction: response.result.transaction,
        latestBlockhash: response.result.latestBlockhash,
        _realGateway: true,
      };
    } catch (error) {
      console.error("❌ Error building gateway transaction:", error);
      return await this.simulateGatewayCall(options.strategy || "hybrid");
    }
  }

  async sendTransaction(encodedTransaction: string) {
    try {
      console.log("🚀 Sending transaction via Gateway...");

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
            },
          ],
        }),
      });

      if (!sendTransactionResponse.ok) {
        const errorText = await sendTransactionResponse.text();
        throw new Error(
          `Gateway send failed: ${sendTransactionResponse.status} - ${errorText}`
        );
      }

      const response = await sendTransactionResponse.json();

      if (response.error) {
        throw new Error(`Gateway error: ${response.error.message}`);
      }

      console.log("✅ Transaction sent via Gateway:", response.result);
      return response.result;
    } catch (error) {
      console.error("❌ Error sending transaction:", error);
      return {
        signature: `simulated_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        _simulated: true,
      };
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
    networkCondition: NetworkCondition,
    fromPubkey?: PublicKey
  ): Promise<{
    success: boolean;
    cost: number;
    latency: number;
    strategyUsed: string;
    signature: string | undefined;
    _realGateway: boolean;
    _networkCondition: string | number | undefined;
  }> {
    try {
      const strategyMap: Record<
        string,
        {
          strategy: "jito" | "rpc" | "hybrid" | "sanctum";
          jitoTipRange?: "low" | "medium" | "high" | "max";
          cuPriceRange?: "low" | "medium" | "high";
        }
      > = {
        safe: {
          strategy: "sanctum",
          jitoTipRange: "low",
          cuPriceRange: "medium",
        },
        balanced: {
          strategy: "hybrid",
          jitoTipRange: "medium",
          cuPriceRange: "medium",
        },
        fast: {
          strategy: "jito",
          jitoTipRange: "high",
          cuPriceRange: "high",
        },
        cheap: {
          strategy: "rpc",
          jitoTipRange: "low",
          cuPriceRange: "low",
        },
      };

      const gatewayOptions = strategyMap[strategy] || {
        strategy: "hybrid",
        cuPriceRange: "medium",
      };

      const hasValidApiKey = process.env.NEXT_PUBLIC_GATEWAY_API_KEY;

      if (hasValidApiKey && fromPubkey) {
        console.log(
          "🔧 Attempting real Gateway transaction with user wallet:",
          fromPubkey.toString()
        );

        const buildResult = await this.buildGatewayTransaction({
          ...gatewayOptions,
          fromPubkey,
        });

        let success;
        let signature;
        let realGatewayUsed = false;

        if ("_realGateway" in buildResult && buildResult._realGateway) {
          realGatewayUsed = true;
          const sendResult = await this.sendTransaction(
            buildResult.transaction
          );

          success = !!sendResult.signature && !sendResult._simulated;
          signature = sendResult.signature;
          console.log("🎯 REAL Gateway transaction attempted:", {
            success,
            signature: signature?.slice(0, 20) + "...",
            fromAddress: fromPubkey.toString(),
          });
        } else {
          type SimulatedBuildResult = {
            _success?: boolean;
            _successRate?: number;
            transaction: string;
            latestBlockhash: {
              blockhash: string;
              lastValidBlockHeight: string;
            };
            _simulated?: boolean;
          };

          success =
            (buildResult as SimulatedBuildResult)._success ||
            Math.random() * 100 < (networkCondition.successRate || 80);
          signature = `simulated_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          console.log("🎮 Using simulation for transaction");
        }

        const adjustedSuccess = realGatewayUsed
          ? success
          : Math.random() * 100 <
            (networkCondition.successRate *
              ("_successRate" in buildResult &&
              typeof buildResult._successRate === "number"
                ? buildResult._successRate
                : 80)) /
              100;

        return {
          success: adjustedSuccess,
          cost: this.getEstimatedCost(strategy),
          latency: this.getLatency(strategy),
          strategyUsed: strategy,
          signature,
          _realGateway: realGatewayUsed,
          _networkCondition: networkCondition.congestion,
        };
      } else {
        if (!fromPubkey) {
          console.log("🔑 No wallet connected, using simulation");
        } else {
          console.log("🔑 No valid Gateway API key, using simulation");
        }
        return this.basicSimulation(strategy, networkCondition);
      }
    } catch (error) {
      console.error("Error in game transaction simulation:", error);
      return this.basicSimulation(strategy, networkCondition);
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
