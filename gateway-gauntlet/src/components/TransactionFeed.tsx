"use client";

import React from "react";
import { TransactionResult } from "@/types/game";
import { CheckCircle, XCircle, Zap, Cpu, Clock } from "lucide-react";
import moment from "moment";

interface TransactionFeedProps {
  transactions: TransactionResult[];
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({
  transactions,
}) => {
  const formatTimestamp = (timestamp: number): string => {
    return moment(timestamp).fromNow();
  };

  const getDetailedTimestamp = (timestamp: number): string => {
    return moment(timestamp).format("MMM D, h:mm:ss A");
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-6 h-96 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-[#e5ff4a]" />
        <h2 className="text-xl font-bold text-white">Transaction Feed</h2>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          {transactions.length}
        </span>
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
              className={`p-3 rounded-xl border backdrop-blur-sm group hover:scale-[1.02] transition-all duration-200 ${
                tx.success
                  ? "border-green-500/30 bg-green-500/10 hover:border-green-500/50"
                  : "border-red-500/30 bg-red-500/10 hover:border-red-500/50"
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
                  <div
                    className="flex items-center gap-1 text-xs text-gray-400 group relative"
                    title={getDetailedTimestamp(tx.timestamp)}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(tx.timestamp)}</span>
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                      {getDetailedTimestamp(tx.timestamp)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-2 flex justify-between items-center">
                <span className="font-medium">{tx.strategyUsed}</span>
                {tx.realGateway && (
                  <span className="text-[#e5ff4a] text-xs bg-[#e5ff4a]/10 px-2 py-1 rounded-full font-semibold">
                    REAL GATEWAY
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Cost:</span>
                  <span className="text-yellow-400 font-medium">
                    {tx.cost.toFixed(4)} SOL
                  </span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-gray-500">Speed:</span>
                  <span className="text-blue-400 font-medium">
                    {tx.latency.toFixed(0)}ms
                  </span>
                </div>
              </div>

              {tx.signature && (
                <div className="mt-2 text-xs">
                  <span className="text-gray-500">Signature: </span>
                  <span
                    className="text-gray-400 font-mono cursor-help truncate block"
                    title={tx.signature}
                  >
                    {tx.signature.slice(0, 12)}...{tx.signature.slice(-8)}
                  </span>
                </div>
              )}

              {tx.error && (
                <div className="text-xs text-red-400 mt-2 bg-red-500/10 px-2 py-1 rounded">
                  {tx.error}
                </div>
              )}

              {tx.networkCondition && (
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🌐</span>
                  <span className="capitalize">
                    {tx.networkCondition} Network
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#e5ff4a]/10">
          <div className="text-xs text-gray-500 text-center">
            Last updated: {moment().format("h:mm:ss A")}
          </div>
        </div>
      )}
    </div>
  );
};
