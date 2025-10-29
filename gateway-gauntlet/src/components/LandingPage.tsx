"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import {
  Zap,
  Shield,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  Send,
  Play,
  ArrowRight,
  Star,
  Rocket,
  Cpu,
  Network,
  CheckCircle,
  Code,
  Server,
  Scale,
  Gamepad,
  Shapes,
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#e5ff4a]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e5ff4a]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#e5ff4a]/7 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-[#e5ff4a]/4 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      <nav className="relative z-20 py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e5ff4a] rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#1b1718]" />
            </div>
            <span className="text-xl font-black bg-linear-to-r from-[#e5ff4a] to-[#ffd700] bg-clip-text text-transparent">
              GATEWAY GAUNTLET
            </span>
          </div>
          <WalletMultiButton />
        </div>
      </nav>

      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl backdrop-blur-sm">
              <span className="text-[#e5ff4a] text-sm font-semibold tracking-wide uppercase">
                Sanctum
              </span>
              <Image
                src="https://mintcdn.com/sanctum-8b4c5bf5/aA2NSy1MLgkLh8kE/logo/dark.svg?fit=max&auto=format&n=aA2NSy1MLgkLh8kE&q=85&s=537b4693ba9d11b0543b118bdec9d400"
                alt="sanctum gateway"
                width={100}
                height={100}
              />
            </div>

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

            <div className="inline-flex items-center gap-4 px-6 py-4 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Code className="w-5 h-5 text-[#e5ff4a]" />
                <span className="text-[#e5ff4a] font-semibold">
                  buildGatewayTransaction
                </span>
              </div>
              <div className="w-px h-6 bg-[#e5ff4a]/30"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Server className="w-5 h-5 text-[#e5ff4a]" />
                <span className="text-[#e5ff4a] font-semibold">
                  sendTransaction
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <WalletMultiButton />
              <button
                onClick={handlePlayWithoutWallet}
                className="group flex items-center gap-3 px-8 py-2.5 border-2 border-[#e5ff4a] text-[#e5ff4a] rounded-xl font-bold hover:bg-[#e5ff4a] hover:text-[#1b1718] transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <Play className="w-5 h-5" />
                Play Without Wallet
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">4</div>
                <div className="text-gray-400 text-sm">Gateway Strategies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">
                  100%
                </div>
                <div className="text-gray-400 text-sm">
                  Real API Integration
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">
                  Live
                </div>
                <div className="text-gray-400 text-sm">Sanctum Gateway</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e5ff4a] mb-2">
                  Free
                </div>
                <div className="text-gray-400 text-sm">To Play & Learn</div>
              </div>
            </div>
          </div>

          <div className="mt-20 bg-black/40 backdrop-blur-lg border border-[#e5ff4a]/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-xl">
                <Code className="w-4 h-4 text-[#e5ff4a]" />
                <span className="text-[#e5ff4a] text-sm font-semibold">
                  LIVE GATEWAY INTEGRATION
                </span>
              </div>
              <h3 className="text-3xl font-black text-white mb-4">
                Real Sanctum Gateway API Calls
              </h3>
              <p className="text-gray-300 text-lg">
                Experience actual transaction building and sending through
                Sanctum Gateway
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#1b1718] border border-[#e5ff4a]/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h4 className="text-lg font-bold text-[#e5ff4a]">
                    buildGatewayTransaction
                  </h4>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Real API call to build optimized transactions with your chosen
                  strategy
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Strategy:</span>
                    <span className="text-[#e5ff4a]">
                      jito | rpc | hybrid | sanctum
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jito Tip:</span>
                    <span className="text-[#e5ff4a]">
                      Optimized automatically
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Result:</span>
                    <span className="text-green-400">Base64 Transaction</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1b1718] border border-[#e5ff4a]/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h4 className="text-lg font-bold text-[#e5ff4a]">
                    sendTransaction
                  </h4>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Real API call to send transactions through Gateway&apos;s
                  optimized network
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="text-[#e5ff4a]">Multi-RPC + Jito</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fallback:</span>
                    <span className="text-[#e5ff4a]">Automatic retry</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Result:</span>
                    <span className="text-green-400">
                      Transaction Signature
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <a href="#strategies" className="flex">
              <div className="group bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
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
            </a>

            <a href="#gameplay" className="flex">
              <div className="group bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-[#e5ff4a]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#e5ff4a]/20 transition-colors">
                  <Gamepad className="w-8 h-8 text-[#e5ff4a]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Gamified Learning
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Earn points and level up by optimizing transactions across
                  different network conditions and congestion levels.
                </p>
              </div>
            </a>

            <a href="#application" className="flex">
              <div className="group bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-[#e5ff4a]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#e5ff4a]/20 transition-colors">
                  <Cpu className="w-8 h-8 text-[#e5ff4a]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Real Skills
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Apply the exact same strategies in your own dApps to save
                  costs and improve transaction reliability immediately.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="strategies" className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-xl">
              <Zap className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-[#e5ff4a] text-sm font-semibold">
                GATEWAY STRATEGIES
              </span>
            </div>
            <h2 className="text-5xl font-black mb-6 text-white">
              Master Transaction Delivery
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Learn 4 professional strategies used by top Solana developers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Safe Sender",
                strategy: "sanctum",
                desc: "Maximum reliability with Sanctum Sender",
                color: "text-green-400",
                risk: "Low",
              },
              {
                icon: TrendingUp,
                title: "Balanced",
                strategy: "hybrid",
                desc: "Jito + RPC fallback for optimal balance",
                color: "text-blue-400",
                risk: "Medium",
              },
              {
                icon: Zap,
                title: "Speed Demon",
                strategy: "jito",
                desc: "Jito bundles for maximum speed",
                color: "text-orange-400",
                risk: "High",
              },
              {
                icon: DollarSign,
                title: "Cost Saver",
                strategy: "rpc",
                desc: "RPC only for lowest cost",
                color: "text-yellow-400",
                risk: "Medium",
              },
            ].map((strategy, index) => (
              <div
                key={index}
                className="group flex flex-col justify-between cursor-pointer bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-[#e5ff4a]/20 hover:border-[#e5ff4a]/40 transition-all duration-300 transform hover:scale-105"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#e5ff4a]/10 rounded-xl flex items-center justify-center group-hover:bg-[#e5ff4a]/20 transition-colors">
                      <strategy.icon className="w-6 h-6 text-[#e5ff4a]" />
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${strategy.color} bg-opacity-20`}
                    >
                      {strategy.risk} Risk
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {strategy.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {strategy.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Gateway:</span>
                  <span className="text-[#e5ff4a] font-mono">
                    {strategy.strategy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gameplay" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-xl">
              <Play className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-[#e5ff4a] text-sm font-semibold">
                HOW IT WORKS
              </span>
            </div>
            <h2 className="text-5xl font-black mb-6 text-white">
              Learn by Doing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Four steps to becoming a Solana transaction expert
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                step: "1",
                title: "Choose Strategy",
                desc: "Select from 4 real Gateway strategies",
              },
              {
                icon: Network,
                step: "2",
                title: "Read Network",
                desc: "Monitor live congestion conditions",
              },
              {
                icon: Send,
                step: "3",
                title: "Send via Gateway",
                desc: "Real buildGatewayTransaction + sendTransaction calls",
              },
              {
                icon: BarChart3,
                step: "4",
                title: "Learn & Optimize",
                desc: "Analyze results and improve strategy",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#e5ff4a]/10 border-2 border-[#e5ff4a]/30 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-[#e5ff4a]/20 group-hover:border-[#e5ff4a]/50 transition-all duration-300">
                    <item.icon className="w-10 h-10 text-[#e5ff4a]" />
                  </div>
                  <div className="absolute -top-2 right-24 w-8 h-8 bg-[#e5ff4a] rounded-full flex items-center justify-center">
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

      <section id="application" className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-xl">
              <Star className="w-4 h-4 text-[#e5ff4a]" />
              <span className="text-[#e5ff4a] text-sm font-semibold">
                WHY SANCTUM GATEWAY
              </span>
            </div>
            <h2 className="text-5xl font-black mb-6 text-white">
              Production-Ready Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Learn the same Gateway features used by leading Solana projects
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                {[
                  {
                    icon: DollarSign,
                    title: "Cost Optimization",
                    desc: "Jito + RPC fallback automatically saves costs when transactions land through standard RPC",
                    feature: "Auto tip refund",
                  },
                  {
                    icon: Shapes,
                    title: "Multiple Delivery",
                    desc: "Choose between Jito bundles, RPC, Sanctum Sender, and hybrid approaches",
                    feature: "4 delivery methods",
                  },
                  {
                    icon: BarChart3,
                    title: "Real-time Analytics",
                    desc: "Monitor transaction success rates, latency, and costs with live observability",
                    feature: "Live metrics",
                  },
                  {
                    icon: Scale,
                    title: "Load Balancing",
                    desc: "Round-robin routing across multiple RPC endpoints for maximum reliability",
                    feature: "Auto failover",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-[#e5ff4a]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#e5ff4a]/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-[#e5ff4a]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-2xl text-white">
                          {feature.title}
                        </h3>
                        <span className="text-xs font-bold text-[#e5ff4a] bg-[#e5ff4a]/10 px-2 py-1 rounded-full">
                          {feature.feature}
                        </span>
                      </div>
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
                  Ready to Master Gateway?
                </h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Start playing Gateway Gauntlet and experience real Sanctum
                  Gateway API integration while learning professional
                  transaction strategies.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Real buildGatewayTransaction calls</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Real sendTransaction calls</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Live Sanctum Gateway integration</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <WalletMultiButton />
                  <button
                    onClick={handlePlayWithoutWallet}
                    className="group flex items-center gap-3 px-6 py-2.5 border-2 border-[#e5ff4a] text-[#e5ff4a] rounded-xl font-bold hover:bg-[#e5ff4a] hover:text-[#1b1718] transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                    Start Learning Now
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-linear-to-br from-[#1b1718] to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-black mb-8">
            Start Your <span className="text-[#e5ff4a]">Gateway</span> Journey
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            No wallet required to learn. Experience real Sanctum Gateway API
            integration and master Solana transaction delivery like a pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handlePlayWithoutWallet}
              className="group flex items-center justify-center gap-4 px-12 py-6 bg-[#e5ff4a] text-[#1b1718] font-black rounded-2xl hover:bg-[#ffd700] transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Rocket className="w-6 h-6" />
              Launch Gateway Gauntlet
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://gateway.sanctum.so"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-4 px-12 py-6 border-2 border-[#e5ff4a] text-[#e5ff4a] font-black rounded-2xl hover:bg-[#e5ff4a] hover:text-[#1b1718] transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Code className="w-6 h-6" />
              Explore Sanctum Gateway
            </a>
          </div>

          {/* Gateway API Status */}
          <div className="mt-12 inline-flex items-center gap-4 px-6 py-4 bg-[#e5ff4a]/10 border border-[#e5ff4a]/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[#e5ff4a] font-semibold">
                Gateway API: Live
              </span>
            </div>
            <div className="w-px h-6 bg-[#e5ff4a]/30"></div>
            <div className="text-gray-300 text-sm">
              Real{" "}
              <code className="bg-[#e5ff4a]/10 px-2 py-1 rounded">
                buildGatewayTransaction
              </code>{" "}
              +{" "}
              <code className="bg-[#e5ff4a]/10 px-2 py-1 rounded">
                sendTransaction
              </code>{" "}
              calls
            </div>
          </div>
        </div>
      </section>

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
