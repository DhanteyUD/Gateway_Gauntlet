"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Zap,
  Shield,
  DollarSign,
  Target,
  BarChart3,
  Send,
  Play,
  ArrowRight,
  Star,
  Rocket,
  Cpu,
  Network,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#1b1718] text-white font-poppins">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#e5ff4a]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e5ff4a]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#e5ff4a]/7 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-[#e5ff4a]/4 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl backdrop-blur-sm">
              <Rocket className="w-5 h-5 text-[#e5ff4a]" />
              <span className="text-[#e5ff4a] text-sm font-semibold tracking-wide">
                SANCTUM HACKATHON 2024
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter">
              <span className="bg-linear-to-r from-[#e5ff4a] via-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent animate-gradient">
                GATEWAY
              </span>
              <br />
              <span className="bg-linear-to-r from-[#ffd700] via-[#e5ff4a] to-[#e5ff4a] bg-clip-text text-transparent animate-gradient">
                GAUNTLET
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master{" "}
              <span className="text-[#e5ff4a] font-semibold">
                Solana transaction delivery
              </span>{" "}
              through an immersive game that teaches you how to optimize costs,
              speed, and reliability with{" "}
              <span className="text-[#e5ff4a] font-semibold">
                Sanctum Gateway
              </span>
              .
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <WalletMultiButton className="bg-[#e5ff4a]! text-[#1b1718]! font-bold! px-8! py-4! rounded-xl! hover:bg-[#ffd700]! transition-all duration-300 transform hover:scale-105 text-lg!" />
              <button
                onClick={handlePlayWithoutWallet}
                className="group flex items-center gap-3 px-8 py-4 border-2 border-[#e5ff4a] text-[#e5ff4a] rounded-xl font-bold hover:bg-[#e5ff4a] hover:text-[#1b1718] transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Play Without Wallet
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">4</div>
                <div className="text-gray-400 text-sm">Strategies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">
                  100%
                </div>
                <div className="text-gray-400 text-sm">Simulation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">
                  Real
                </div>
                <div className="text-gray-400 text-sm">Gateway Tech</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">
                  Free
                </div>
                <div className="text-gray-400 text-sm">To Play</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32">
            <div className="group bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-[#e5ff4a]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#e5ff4a]/20 transition-colors">
                <Zap className="w-8 h-8 text-[#e5ff4a]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Learn Gateway Strategies
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Master Safe, Balanced, Fast, and Cheap transaction strategies
                used by professional Solana developers in production.
              </p>
            </div>

            <div className="group bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-[#e5ff4a]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#e5ff4a]/20 transition-colors">
                <Target className="w-8 h-8 text-[#e5ff4a]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Gamified Learning
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Earn points and level up by optimizing transactions across
                different network conditions and congestion levels.
              </p>
            </div>

            <div className="group bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-[#e5ff4a]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#e5ff4a]/20 transition-colors">
                <Cpu className="w-8 h-8 text-[#e5ff4a]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Real Skills
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Apply the exact same strategies in your own dApps to save costs
                and improve transaction reliability immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-xl">
              <BarChart3 className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-[#e5ff4a] text-sm font-semibold">
                HOW IT WORKS
              </span>
            </div>
            <h2 className="text-5xl font-black mb-6">
              Master Transaction Delivery
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Four simple steps to becoming a Solana transaction expert
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                step: "1",
                title: "Choose Strategy",
                desc: "Select from Safe, Balanced, Fast, or Cheap delivery methods",
              },
              {
                icon: Network,
                step: "2",
                title: "Read Network",
                desc: "Monitor real-time network conditions and congestion levels",
              },
              {
                icon: Send,
                step: "3",
                title: "Send Transaction",
                desc: "Execute your strategy and see real-time performance",
              },
              {
                icon: Zap,
                step: "4",
                title: "Optimize & Score",
                desc: "Learn from results and improve to maximize points",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#e5ff4a]/10 border-2 border-[#e5ff4a]/30 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-[#e5ff4a]/20 group-hover:border-[#e5ff4a]/50 transition-all duration-300">
                    <item.icon className="w-10 h-10 text-[#e5ff4a]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#e5ff4a] rounded-full flex items-center justify-center">
                    <span className="text-[#1b1718] text-sm font-black">
                      {item.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gateway Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-xl">
              <Star className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-[#e5ff4a] text-sm font-semibold">
                POWERED BY
              </span>
            </div>
            <h2 className="text-5xl font-black mb-6">Sanctum Gateway</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the same transaction optimization features used by
              leading Solana projects
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                {[
                  {
                    icon: DollarSign,
                    title: "Cost Optimization",
                    desc: "Jito + RPC fallback saves costs when transactions land through standard RPC",
                  },
                  {
                    icon: Zap,
                    title: "Multiple Delivery Methods",
                    desc: "Choose between Jito bundles, RPC, Sanctum Sender, and hybrid approaches",
                  },
                  {
                    icon: BarChart3,
                    title: "Real-time Observability",
                    desc: "Monitor transaction success rates, latency, and costs in real-time",
                  },
                  {
                    icon: Network,
                    title: "Load Balancing",
                    desc: "Round-robin routing across multiple RPC endpoints for maximum reliability",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-[#e5ff4a]/10 rounded-xl flex items-center justify-center shrink-0 mt-1 group-hover:bg-[#e5ff4a]/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-[#e5ff4a]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-3 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-lg p-10 rounded-3xl border border-[#e5ff4a]/20 shadow-2xl shadow-[#e5ff4a]/5">
              <div className="text-center">
                <div className="text-7xl mb-6">🎯</div>
                <h3 className="text-3xl font-black mb-6 text-white">
                  Ready to Master Solana Transactions?
                </h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Start playing Gateway Gauntlet and learn how to optimize your
                  Solana transactions like a professional developer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <WalletMultiButton className="bg-[#e5ff4a]! text-[#1b1718]! font-bold! px-6! py-4! rounded-xl! hover:bg-[#ffd700]! transition-all duration-300 transform hover:scale-105" />
                  <button
                    onClick={handlePlayWithoutWallet}
                    className="group flex items-center gap-3 px-6 py-4 border-2 border-[#e5ff4a] text-[#e5ff4a] rounded-xl font-bold hover:bg-[#e5ff4a] hover:text-[#1b1718] transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                    Start Playing Now
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-linear-to-br from-[#1b1718] to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-black mb-8">
            Start Your <span className="text-[#e5ff4a]">Gateway</span> Journey
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            No wallet required to learn. Connect your wallet when you&apos;re
            ready to experience the full power of Sanctum Gateway with real
            transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handlePlayWithoutWallet}
              className="group flex items-center justify-center gap-4 px-12 py-6 bg-[#e5ff4a] text-[#1b1718] font-black rounded-2xl hover:bg-[#ffd700] transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Rocket className="w-6 h-6" />
              🎮 Launch Gateway Gauntlet
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://gateway.sanctum.so"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-4 px-12 py-6 border-2 border-[#e5ff4a] text-[#e5ff4a] font-black rounded-2xl hover:bg-[#e5ff4a] hover:text-[#1b1718] transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Zap className="w-6 h-6" />
              Explore Sanctum Gateway
            </a>
          </div>
        </div>
      </section>

      {/* Custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
};
