import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gatewayService } from "@/services/gatewayService";
import { GAME_STRATEGIES } from "@/constants/gameConfig";

export const GATEWAY_HOST_ADDRESS =
  process.env.NEXT_PUBLIC_GATEWAY_HOST_ADDRESS ||
  "5K5oxh6yizEe3wMUxKLWVovjMUrBrqeD5tKvRPvowZxF";

export const useGatewayTransaction = () => {
  const queryClient = useQueryClient();

  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({ strategyId }: { strategyId: string }) => {
      if (!publicKey || !signTransaction) {
        throw new Error("Wallet not connected or cannot sign");
      }

      const strategy = GAME_STRATEGIES.find((s) => s.id === strategyId);
      if (!strategy) {
        throw new Error("Invalid strategy");
      }

      const toPubKey = new PublicKey(GATEWAY_HOST_ADDRESS);
      const lamports = strategy.cost * LAMPORTS_PER_SOL;

      const gatewayOptions = {
        strategy: strategy.gatewayOptions.strategy,
        jitoTipRange: strategy.gatewayOptions.jitoTipRange,
        cuPriceRange: strategy.gatewayOptions.cuPriceRange,
        skipSimulation: strategy.gatewayOptions.skipSimulation,
        fromPubkey: publicKey,
      };

      console.log("🔧 Building Gateway transaction with real SOL...");
      console.log("💰 Sending:", lamports / LAMPORTS_PER_SOL, "SOL");
      console.log("📍 From:", publicKey.toString());
      console.log("📍 To:", toPubKey.toString());

      const buildResult = await gatewayService.buildGatewayTransaction({
        ...gatewayOptions,
        fromPubkey: publicKey,
        toPubkey: toPubKey,
        lamports,
      });

      if (buildResult._simulated) {
        throw new Error("Gateway returned simulated transaction");
      }

      console.log("✅ Gateway built transaction successfully");
      console.log("📦 Gateway response:", {
        hasTransaction: !!buildResult.transaction,
        transactionLength: buildResult.transaction?.length,
      });

      const transactionBuffer = Buffer.from(buildResult.transaction, "base64");

      console.log("📦 Transaction buffer length:", transactionBuffer.length);

      let transaction: Transaction | VersionedTransaction;

      try {
        transaction = Transaction.from(transactionBuffer);
        console.log("✅ Successfully decoded as legacy Transaction");
      } catch (error) {
        console.log("❌ Failed to decode transaction:", error);
        throw new Error("Failed to decode Gateway transaction");
      }

      console.log("✍️ Signing transaction with wallet...");
      console.log("📦 Transaction details:", {
        signatures: transaction.signatures.length,
        instructions: transaction.instructions.length,
        feePayer: transaction.feePayer?.toString(),
      });

      const signedTransaction = await signTransaction(transaction);

      console.log("✅ Transaction signed");
      console.log("🚀 Sending signed transaction via Gateway...");

      const serialized = signedTransaction.serialize();
      const base64Transaction = Buffer.from(serialized).toString("base64");

      console.log("📦 Signed transaction length:", serialized.length);

      const sendResult = await gatewayService.sendTransaction(
        base64Transaction
      );

      if (
        !sendResult.signature ||
        sendResult.signature.startsWith("simulated_")
      ) {
        throw new Error("Failed to send real transaction");
      }

      console.log("✅ Transaction sent! Signature:", sendResult.signature);
      console.log("⏳ Confirming transaction...");

      await connection.confirmTransaction(sendResult.signature, "confirmed");

      console.log("✅ Transaction confirmed!");

      return {
        signature: sendResult.signature,
        strategy: strategy.name,
        cost: strategy.cost,
        realGateway: true,
        realTransaction: true,
      };
    },

    onSuccess: (result) => {
      if (publicKey) {
        queryClient.invalidateQueries({
          queryKey: ["solana-balance", publicKey.toBase58()],
        });
        queryClient.invalidateQueries({
          queryKey: ["solana-transactions", publicKey.toBase58()],
        });
      }

      console.log(
        `🎯 Real transaction sent via Gateway:`,
        result.signature.slice(0, 8) + "..."
      );
    },

    onError: (error) => {
      console.log("❌ Transaction failed:", error);
    },
  });

  return mutation;
};

export const useSolBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["solana-balance", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) throw new Error("No wallet connected");

      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    },
    enabled: !!publicKey,
    refetchInterval: 10000,
    staleTime: 5000,
  });
};
