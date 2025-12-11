import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
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
  const { publicKey } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({ strategyId }: { strategyId: string }) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
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
      };

      try {
        console.log("🔧 Building Gateway transaction...");
        const buildResult = await gatewayService.buildGatewayTransaction({
          ...gatewayOptions,
          jitoTip: Math.floor(lamports * 0.01),
        });

        let signature: string;

        if (!("_simulated" in buildResult) || !buildResult._simulated) {
          const sendResult = await gatewayService.sendTransaction(
            buildResult.transaction
          );
          signature = sendResult.signature;
        } else {
          console.log("🎮 Falling back to regular transaction...");
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: toPubKey,
              lamports,
            })
          );

          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = publicKey;

          throw new Error("Wallet sending not implemented - using simulation");
        }

        if (signature && !signature.startsWith("simulated_")) {
          await connection.confirmTransaction(signature, "confirmed");
        }

        return {
          signature,
          strategy: strategy.name,
          cost: strategy.cost,
          realGateway: !!(
            "_realGateway" in buildResult && buildResult._realGateway
          ),
        };
      } catch (error) {
        console.error("Transaction error:", error);
        return {
          signature: `simulated_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          strategy: strategy.name,
          cost: strategy.cost,
          realGateway: false,
          simulated: true,
        };
      }
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
        `🎯 Transaction ${result.realGateway ? "via Gateway" : "simulated"}:`,
        result.signature.slice(0, 8) + "..."
      );
    },

    onError: (error) => {
      console.error("Transaction failed:", error);
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
