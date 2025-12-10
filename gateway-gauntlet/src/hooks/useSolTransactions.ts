import { useQuery } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type {
  Connection,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";

const fetchTransactions = async (
  connection: Connection,
  publicKey: PublicKey | null
): Promise<unknown[]> => {
  try {
    if (!publicKey) throw new Error("No wallet connected");

    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 10,
    });

    const results = await Promise.allSettled(
      signatures.map((sig) =>
        connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        })
      )
    );

    return results
      .filter(
        (
          res
        ): res is PromiseFulfilledResult<VersionedTransactionResponse | null> =>
          res.status === "fulfilled"
      )
      .map((res) => res.value)
      .filter((tx): tx is VersionedTransactionResponse => tx !== null)
      .map((tx) => ({
        signature: tx.transaction.signatures[0],
        timestamp: tx.blockTime ? new Date(tx.blockTime * 1000) : new Date(),
        fee: tx.meta?.fee || 0,
        success: !tx.meta?.err,
      }));
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};

export const useSolTransactions = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["solana-transactions", publicKey?.toBase58()],
    queryFn: () => fetchTransactions(connection, publicKey),
    enabled: !!publicKey,
    staleTime: 30000,
  });
};
