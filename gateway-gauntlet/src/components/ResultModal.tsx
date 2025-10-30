"use client";

import React from "react";
import { TransactionResult } from "@/types/game";
import {
  X,
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Scale,
  Copy,
} from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TransactionResult | null;
  gameState: {
    score: number;
    transactionsAttempted: number;
    transactionsSuccessful: number;
    totalCost: number;
    currentLevel: number;
  };
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  result,
  gameState,
}) => {
  if (!isOpen || !result) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#1b1718] border border-[#e5ff4a]/30 rounded-2xl max-w-md w-full shadow-2xl shadow-[#e5ff4a]/10 animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-[#e5ff4a]/20">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                result.success ? "bg-green-400/10" : "bg-red-400/10"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {result.success
                  ? "Transaction Successful!"
                  : "Transaction Failed"}
              </h2>
              <p className="text-sm text-gray-400">
                {result.success
                  ? "Your transaction landed successfully"
                  : "Transaction did not complete"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#e5ff4a]/10 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#e5ff4a]/10 rounded-lg flex items-center justify-center">
                    {(() => {
                      const strategy = result.strategyUsed.toLowerCase();
                      const iconClass = "w-4 h-4 text-[#e5ff4a]";

                      switch (strategy) {
                        case "safe":
                          return <Shield className={iconClass} />;
                        case "balanced":
                          return <Scale className={iconClass} />;
                        case "fast":
                          return <Zap className={iconClass} />;
                        case "cheap":
                          return <DollarSign className={iconClass} />;
                        default:
                          return <BarChart3 className={iconClass} />;
                      }
                    })()}
                  </div>
                </div>
                <span className="text-gray-400">Strategy</span>
              </div>
              <span className="font-semibold text-white capitalize">
                {result.strategyUsed}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-400">Cost</span>
              </div>
              <span className="font-semibold text-yellow-400">
                {result.cost.toFixed(6)} SOL
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-400/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-400">Latency</span>
              </div>
              <span className="font-semibold text-purple-400">
                {result.latency.toFixed(0)}ms
              </span>
            </div>
          </div>

          {result.realGateway && (
            <div className="flex items-center justify-between p-3 bg-green-400/10 rounded-xl border border-green-400/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-400">Gateway</span>
              </div>
              <span className="font-semibold text-green-400">
                Real Gateway Used
              </span>
            </div>
          )}

          {result.signature && !result.signature.startsWith("simulated_") ? (
            <div className="p-3 bg-black/40 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Transaction ID</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-gray-300 font-mono bg-black/30 px-2 py-1 rounded truncate">
                  {result.signature}
                </code>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(result.signature!)}
                    className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                    title="Copy signature"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                  {!result.signature.startsWith("simulated_") && (
                    <a
                      href={getExplorerUrl(result.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                      title="View in explorer"
                    >
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {result.error && (
            <div className="p-3 bg-red-400/10 rounded-xl border border-red-400/30">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">Error</span>
              </div>
              <p className="text-xs text-red-300">{result.error}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#e5ff4a]/20 bg-black/30">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#e5ff4a]">
                {gameState.score}
              </p>
              <p className="text-xs text-gray-400">Total Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {gameState.transactionsSuccessful}/
                {gameState.transactionsAttempted}
              </p>
              <p className="text-xs text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#e5ff4a]/20">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-[#e5ff4a] text-[#1b1718] font-bold rounded-xl hover:bg-[#ffd700] transition-all duration-300 cursor-pointer"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};
