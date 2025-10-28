import React from "react";
import { TransactionResult } from "@/types/game";

interface TransactionFeedProps {
  transactions: TransactionResult[];
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({
  transactions,
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 h-96 overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">Transaction Feed</h2>

      <div className="space-y-3 overflow-y-auto h-80">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center">No transactions yet</p>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                tx.success
                  ? "border-green-500 bg-green-500/10"
                  : "border-red-500 bg-red-500/10"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`font-semibold ${
                    tx.success ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tx.success ? "SUCCESS" : "FAILED"}
                </span>
                <span className="text-xs text-gray-400">
                  {tx.latency.toFixed(0)}ms
                </span>
              </div>

              <div className="text-sm text-gray-300 mb-1">
                {tx.strategyUsed}
              </div>

              <div className="text-xs text-gray-400 flex justify-between">
                <span>Cost: {tx.cost.toFixed(4)} SOL</span>
                {tx.signature && (
                  <span className="truncate max-w-[120px]">
                    {tx.signature.slice(0, 8)}...
                  </span>
                )}
              </div>

              {tx.error && (
                <div className="text-xs text-red-400 mt-1">
                  Error: {tx.error}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
