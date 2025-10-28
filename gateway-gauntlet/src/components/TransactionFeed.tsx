import React from "react";
import { TransactionResult } from "@/types/game";
import { CheckCircle, XCircle, Zap, Cpu } from "lucide-react";

interface TransactionFeedProps {
  transactions: TransactionResult[];
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({
  transactions,
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 h-96 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-[#e5ff4a]" />
        <h2 className="text-xl font-bold text-white">Transaction Feed</h2>
      </div>

      <div className="space-y-3 overflow-y-auto h-80">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Cpu className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">
              Send your first transaction to see results
            </p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border backdrop-blur-sm ${
                tx.success
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-red-500/30 bg-red-500/10"
              } ${tx.realGateway ? "ring-1 ring-[#e5ff4a]/30" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {tx.success ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={`font-semibold text-sm ${
                      tx.success ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.success ? "SUCCESS" : "FAILED"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {tx.realGateway && <Zap className="w-3 h-3 text-[#e5ff4a]" />}
                  <span className="text-xs text-gray-400">
                    {tx.latency.toFixed(0)}ms
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-2 flex justify-between">
                <span>{tx.strategyUsed}</span>
                {tx.realGateway && (
                  <span className="text-[#e5ff4a] text-xs">REAL GATEWAY</span>
                )}
              </div>

              <div className="text-xs text-gray-400 flex justify-between items-center">
                <span>Cost: {tx.cost.toFixed(4)} SOL</span>
                <div className="flex items-center gap-2">
                  {tx.signature && (
                    <span className="truncate max-w-[100px] text-gray-500">
                      {tx.signature.slice(0, 8)}...
                    </span>
                  )}
                </div>
              </div>

              {tx.error && (
                <div className="text-xs text-red-400 mt-2">{tx.error}</div>
              )}

              {tx.networkCondition && (
                <div className="text-xs text-gray-500 mt-1">
                  Network: {tx.networkCondition}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
