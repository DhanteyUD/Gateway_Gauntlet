"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface LandingPageProps {
  onPlayWithoutWallet: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlayWithoutWallet,
}) => {
  const { connected } = useWallet();

  if (connected) {
    return null;
  }

  const handlePlayWithoutWallet = () => {
    onPlayWithoutWallet();
  };

  return (
    <div className="min-h-screen bg-sanctum-dark text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-sanctum-primary/20 border border-sanctum-primary rounded-full">
              <span className="text-sanctum-primary text-sm font-semibold">
                Sanctum Hackathon 2024
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-linear-to-r from-sanctum-primary to-sanctum-secondary bg-clip-text text-transparent">
                Gateway
              </span>
              <br />
              <span className="bg-linear-to-r from-sanctum-secondary to-sanctum-primary bg-clip-text text-transparent">
                Gauntlet
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Master Solana transaction delivery through an immersive game that
              teaches you how to optimize costs, speed, and reliability with{" "}
              <span className="text-sanctum-primary font-semibold">
                Sanctum Gateway
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <WalletMultiButton className="bg-sanctum-primary! text-black! font-bold! px-8! py-3! rounded-lg! hover:bg-sanctum-secondary! transition-colors" />
              <button
                onClick={handlePlayWithoutWallet}
                className="px-8 py-3 border-2 border-sanctum-secondary text-sanctum-secondary rounded-lg font-bold hover:bg-sanctum-secondary hover:text-black transition-colors"
              >
                Play Without Wallet
              </button>
            </div>
          </div>

          {/* Rest of your landing page content remains the same */}
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-sanctum-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Learn Gateway Strategies
              </h3>
              <p className="text-gray-400">
                Master Safe, Balanced, Fast, and Cheap transaction strategies
                used by professional Solana developers.
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-sanctum-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Gamified Learning</h3>
              <p className="text-gray-400">
                Earn points by optimizing transactions across different network
                conditions and congestion levels.
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-sanctum-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Real Skills</h3>
              <p className="text-gray-400">
                Apply the same strategies in your own dApps to save costs and
                improve transaction reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How Gateway Gauntlet Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sanctum-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-sanctum-primary">
                <span className="text-2xl font-bold text-sanctum-primary">
                  1
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Choose Strategy</h3>
              <p className="text-gray-400 text-sm">
                Select from Safe, Balanced, Fast, or Cheap transaction delivery
                methods
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sanctum-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-sanctum-primary">
                <span className="text-2xl font-bold text-sanctum-primary">
                  2
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Read Network</h3>
              <p className="text-gray-400 text-sm">
                Monitor real-time network conditions and congestion levels
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sanctum-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-sanctum-primary">
                <span className="text-2xl font-bold text-sanctum-primary">
                  3
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Send Transaction</h3>
              <p className="text-gray-400 text-sm">
                Execute your strategy and see how it performs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sanctum-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-sanctum-primary">
                <span className="text-2xl font-bold text-sanctum-primary">
                  4
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Optimize & Score</h3>
              <p className="text-gray-400 text-sm">
                Learn from results and improve your strategy to maximize points
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gateway Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Powered by Sanctum Gateway
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Experience the same transaction optimization features used by
            leading Solana projects
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Cost Optimization
                    </h3>
                    <p className="text-gray-400">
                      Jito + RPC fallback saves costs when transactions land
                      through standard RPC
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Multiple Delivery Methods
                    </h3>
                    <p className="text-gray-400">
                      Choose between Jito bundles, RPC, Sanctum Sender, and
                      hybrid approaches
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Real-time Observability
                    </h3>
                    <p className="text-gray-400">
                      Monitor transaction success rates, latency, and costs in
                      real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Load Balancing</h3>
                    <p className="text-gray-400">
                      Round-robin routing across multiple RPC endpoints for
                      maximum reliability
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Master Solana Transactions?
                </h3>
                <p className="text-gray-400 mb-6">
                  Start playing Gateway Gauntlet and learn how to optimize your
                  Solana transactions like a pro.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <WalletMultiButton className="bg-sanctum-primary! text-black! font-bold! px-6! py-3! rounded-lg! hover:bg-sanctum-secondary! transition-colors" />
                  <button
                    onClick={handlePlayWithoutWallet}
                    className="px-6 py-3 border-2 border-sanctum-secondary text-sanctum-secondary rounded-lg font-bold hover:bg-sanctum-secondary hover:text-black transition-colors"
                  >
                    Start Playing Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-br from-sanctum-dark to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Start Your <span className="text-sanctum-primary">Gateway</span>{" "}
            Journey
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No wallet required to learn. Connect your wallet when you&apos;re
            ready to experience the full power of Sanctum Gateway.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePlayWithoutWallet}
              className="px-8 py-4 bg-sanctum-primary text-black font-bold rounded-lg hover:bg-sanctum-secondary transition-colors text-lg"
            >
              🎮 Launch Game
            </button>
            <a
              href="https://gateway.sanctum.so"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-sanctum-secondary text-sanctum-secondary font-bold rounded-lg hover:bg-sanctum-secondary hover:text-black transition-colors text-lg"
            >
              Explore Sanctum Gateway
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
