"use client";

import React, { useState } from "react";
import { TransactionResult } from "@/types/game";
import {
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  Filter,
  BarChart3,
  BadgeDollarSign,
  CircleStar,
  BadgeCheck,
  BadgeX,
  Wifi,
} from "lucide-react";
import moment from "moment";

interface TransactionFeedProps {
  transactions: TransactionResult[];
}

type FilterType = "all" | "success" | "failed";

export const TransactionFeed: React.FC<TransactionFeedProps> = ({
  transactions,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const formatTimestamp = (timestamp: number): string => {
    return moment(timestamp).fromNow();
  };

  const getDetailedTimestamp = (timestamp: number): string => {
    return moment(timestamp).format("MMM D, YYYY h:mm:ss A");
  };

  const filteredTransactions = transactions.filter((tx) => {
    switch (activeFilter) {
      case "success":
        return tx.success;
      case "failed":
        return !tx.success;
      default:
        return true;
    }
  });

  const stats = {
    total: transactions.length,
    success: transactions.filter((tx) => tx.success).length,
    failed: transactions.filter((tx) => !tx.success).length,
    realGateway: transactions.filter((tx) => tx.realGateway).length,
  };

  const getSuccessRate = (): string => {
    if (stats.total === 0) return "0%";
    return `${((stats.success / stats.total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-linear-to-br from-black/60 to-[#1b1718]/80 backdrop-blur-xl border border-[#e5ff4a]/30 rounded-3xl p-6 shadow-2xl shadow-[#e5ff4a]/10 h-full flex flex-col">
      <div className="flex flex-col items-start justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-[#e5ff4a] to-[#ffd700] rounded-xl flex items-center justify-center">
            <BadgeDollarSign className="w-5 h-5 text-[#1b1718]" />
          </div>
          <div>
            <h2 className="text-2xl font-black bg-linear-to-r from-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent">
              Transaction Feed
            </h2>
            <p className="text-gray-400 text-sm">Live transaction monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-5 w-full justify-center">
          <BarChart3 className="w-4 h-4" />
          <span>{getSuccessRate()} success rate</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-2xl border border-[#e5ff4a]/20 shrink-0">
        {[
          {
            key: "all" as FilterType,
            label: "All",
            count: stats.total,
            icon: CircleStar,
            color: "black",
          },
          {
            key: "success" as FilterType,
            label: "Success",
            count: stats.success,
            icon: BadgeCheck,
            color: "green",
          },
          {
            key: "failed" as FilterType,
            label: "Failed",
            count: stats.failed,
            icon: BadgeX,
            color: "red",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`flex items-center gap-2 px-2 py-2 rounded-xl font-semibold transition-all duration-300 flex-1 justify-center cursor-pointer ${
              activeFilter === tab.key
                ? "bg-linear-to-r from-[#e5ff4a] to-[#ffd700] text-[#1b1718] shadow-lg shadow-[#e5ff4a]/25"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon
              className="text-sm"
              style={{
                color:
                  tab.color === "green"
                    ? activeFilter === tab.key
                      ? "#1b1718"
                      : "#05df72"
                    : tab.color === "red"
                    ? activeFilter === tab.key
                      ? "#1b1718"
                      : "lab(63.7053% 60.745 31.3109)"
                    : activeFilter === tab.key
                    ? "#1b1718"
                    : "#9ca3af",
              }}
            />
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === tab.key
                  ? "bg-[#1b1718]/30 text-[#1b1718]"
                  : "bg-gray-700/50 text-gray-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 min-h-0 scrollbar-thin scrollbar-thumb-[#e5ff4a]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#e5ff4a]/50">
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-semibold mb-2">
                No transactions found
              </p>
              <p className="text-xs">
                {activeFilter === "all"
                  ? "Send your first transaction to see results"
                  : `No ${activeFilter} transactions match your filter`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx, index) => (
              <div
                key={index}
                className={`group p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                  tx.success
                    ? "border-green-400/30 bg-linear-to-r from-green-500/5 to-green-500/10 hover:border-green-400/50 hover:shadow-green-500/10"
                    : "border-red-400/30 bg-linear-to-r from-red-500/5 to-red-500/10 hover:border-red-400/50 hover:shadow-red-500/10"
                }${tx.realGateway ? "ring-1 ring-[#e5ff4a]/30" : ""}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    {tx.success ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500/30">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/30">
                        <XCircle className="w-4 h-4 text-red-400" />
                      </div>
                    )}
                    <span
                      className={`font-semibold text-sm ${
                        tx.success ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {tx.success ? "YAY" : "UH-OH"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tx.realGateway && (
                      <Zap className="w-3 h-3 text-[#e5ff4a]" />
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400 group relative">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(tx.timestamp)}</span>
                      <div className="absolute top-5 right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                        {getDetailedTimestamp(tx.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-300 flex gap-2 items-center mb-3">
                  <span className="text-xs text-gray-300 font-medium capitalize bg-gray-500/20 px-3 py-1 rounded-full">
                    {tx.strategyUsed}
                  </span>
                  {tx.realGateway && (
                    <span className="flex items-center gap-1 text-xs bg-[#e5ff4a]/20 text-[#e5ff4a] px-2 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      gateway
                    </span>
                  )}
                </div>

                <div
                  className={`group p-4 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                    tx.success
                      ? "border-green-400/30 bg-linear-to-r from-green-500/5 to-green-500/10 hover:border-green-400/50 hover:shadow-green-500/10"
                      : "border-red-400/30 bg-linear-to-r from-red-500/5 to-red-500/10 hover:border-red-400/50 hover:shadow-red-500/10"
                  } ${
                    tx.realGateway
                      ? "ring-2 ring-[#e5ff4a]/40 shadow-lg shadow-[#e5ff4a]/10"
                      : ""
                  }`}
                >
                  <div className="grid grid-cols-1 gap-4 mb-3">
                    <div className="flex justify-between gap-1 text-xs text-gray-400">
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

                    {tx.networkCondition && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Wifi size={15} />
                        <span className="capitalize">
                          {tx.networkCondition} Network
                        </span>
                      </div>
                    )}

                    {tx.signature && (
                      <div className="text-xs">
                        <span className="text-gray-500">Signature: </span>
                        <span
                          className="text-gray-400 font-mono cursor-help truncate block"
                          title={tx.signature}
                        >
                          {tx.signature.slice(0, 12)}...{tx.signature.slice(-8)}
                        </span>
                      </div>
                    )}
                  </div>

                  {tx.error && (
                    <div className="mt-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="text-xs text-red-400 font-medium">
                        {tx.error}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#e5ff4a]/10 shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live feed</span>
            </div>
            <div>Last updated: {moment().format("h:mm A")}</div>
          </div>
        </div>
      )}
    </div>
  );
};
