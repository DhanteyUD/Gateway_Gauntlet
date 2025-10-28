// services/gatewayService.ts
import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";
import {
  GatewayProvider,
  buildGatewayTransaction,
  sendTransaction,
} from "@gateway-xyz/gateway-js";

class GatewayService {
  private gatewayProvider: GatewayProvider;

  constructor() {
    this.gatewayProvider = new GatewayProvider({
      connection: new Connection(clusterApiUrl("devnet")),
      wallet: null, // Will be set dynamically
      options: {
        strategy: "jito",
        jitoTip: 100000, // 0.0001 SOL
        useRelay: true,
      },
    });
  }

  setWallet(wallet: any) {
    this.gatewayProvider = new GatewayProvider({
      connection: new Connection(clusterApiUrl("devnet")),
      wallet: wallet,
      options: {
        strategy: "jito",
        jitoTip: 100000,
        useRelay: true,
      },
    });
  }

  async buildGameTransaction(instructions: any[], options: any = {}) {
    try {
      const transaction = await buildGatewayTransaction({
        instructions,
        options: {
          strategy: options.strategy || "jito",
          jitoTip: options.jitoTip || 100000,
          useRelay: options.useRelay !== false,
          ...options,
        },
      });
      return transaction;
    } catch (error) {
      console.error("Error building gateway transaction:", error);
      throw error;
    }
  }

  async sendGameTransaction(transaction: Transaction | VersionedTransaction) {
    try {
      const signature = await sendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  async simulateTransaction(transaction: Transaction | VersionedTransaction) {
    // This would integrate with Gateway's observability features
    return {
      successRate: Math.random() * 100,
      estimatedCost: 0.0001 + Math.random() * 0.001,
      latency: 100 + Math.random() * 900,
      strategy: "jito+rpc",
    };
  }
}

export const gatewayService = new GatewayService();
