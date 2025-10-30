# ⚡ Gateway Gauntlet

> **Master Solana Transaction Optimization Through Interactive Gamified Learning**

[![Sanctum Hackathon](https://img.shields.io/badge/Sanctum-Hackathon-1b1718?style=for-the-badge&logo=solana&labelColor=e5ff4a&color=1b1718)](https://gateway.sanctum.so)
[![Solana](https://img.shields.io/badge/Solana-Devnet-1b1718?style=for-the-badge&logo=solana&labelColor=9945FF&color=1b1718)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-1b1718?style=for-the-badge&logo=next.js&labelColor=000000&color=1b1718)](https://nextjs.org)

Gateway Gauntlet is an immersive educational game that teaches developers how to optimize Solana transactions using **Sanctum Gateway**. Learn real-world transaction delivery strategies through risk-free simulation and master the art of cost optimization, speed, and reliability on Solana.

---

![Gateway Gauntlet Preview](https://via.placeholder.com/1200x600/1b1718/e5ff4a?text=Gateway+Gauntlet+-+Master+Solana+Transactions)

---

## 🎯 The Problem

Building on Solana requires deep understanding of transaction delivery strategies, but developers face significant challenges:

- **Complex Learning Curve** - Transaction optimization concepts are difficult to grasp from documentation alone
- **Expensive Experimentation** - Testing strategies with real transactions incurs costs and risks
- **Dynamic Network Conditions** - Constantly changing congestion requires adaptive approaches
- **Feature Discovery** - Advanced Gateway features like Jito+RPC fallback aren't immediately intuitive

**Gateway Gauntlet** provides a risk-free, engaging environment where you can master Solana transaction optimization without spending SOL or dealing with failed transactions.

---

## ✨ Features

### 🎮 Interactive Learning Experience

- **4 Strategic Approaches** - Safe, Balanced, Fast, and Cheap transaction modes
- **Real-Time Network Simulation** - Dynamic congestion levels that mirror mainnet conditions
- **Instant Feedback** - Learn from every transaction attempt
- **Progressive Difficulty** - Level up as your understanding deepens

### ⚡ Sanctum Gateway Education

- **Production Strategy Simulation** - Learn techniques used in real dApps
- **Cost vs Speed Trade-offs** - Understand when to use Jito bundles vs RPC
- **Multi-Method Delivery** - Experience RPC, Jito bundles, and Sanctum Sender
- **Intelligent Routing** - Grasp load balancing and fallback mechanisms

### 📊 Performance Tracking

- **Detailed Analytics** - Track success rates, costs, and latency
- **Strategy Comparison** - See which approaches work best in different conditions
- **Scoring System** - Compete against yourself and optimize your decision-making
- **Transaction History** - Review past transactions to identify patterns

---

## 🕹️ How to Play

### 1. **Choose Your Strategy**

Each strategy has unique characteristics suited for different scenarios:

| Strategy | Icon | Use Case | Cost | Speed | Reliability |
|----------|:----:|----------|:----:|:-----:|:-----------:|
| **Safe** | 🛡️ | Mission-critical transactions | Medium | Medium | ⭐⭐⭐⭐⭐ |
| **Balanced** | ⚖️ | General-purpose usage | Medium | Medium | ⭐⭐⭐⭐ |
| **Fast** | ⚡ | Time-sensitive operations | **High** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Cheap** | 💰 | Cost-sensitive, non-urgent | **Very Low** | ⭐⭐ | ⭐⭐⭐ |

### 2. **Monitor Network Conditions**

Network congestion directly impacts transaction success:

- 🟢 **Low Congestion** - All strategies work well
- 🟡 **Medium Congestion** - Strategy choice begins to matter
- 🟠 **High Congestion** - Requires optimization knowledge
- 🔴 **Extreme Congestion** - Only smart strategies succeed

### 3. **Send Transactions & Learn**

- Select a strategy based on current network conditions
- Observe transaction outcomes in real-time
- Analyze cost, latency, and success metrics
- Build intuition through the live transaction feed

### 4. **Optimize Your Score**

Points are awarded based on multiple factors:

- **Success Bonus** - `+100` points per confirmed transaction
- **Cost Efficiency** - Bonus points for cheaper successful transactions
- **Speed Performance** - Rewards for low-latency delivery
- **Level Multiplier** - Your score potential increases with experience
- **Failure Penalty** - `-5` points (small penalty encourages learning)

**Pro Tip**: The highest scores come from matching the right strategy to network conditions!

---

## 🛠️ Technology Stack

### Frontend

- ![Next.js](https://img.shields.io/badge/Next.js-16.0-000000?style=flat-square&logo=next.js)
- ![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)

### Solana Integration

- ![Solana Web3.js](https://img.shields.io/badge/Solana_Web3.js-1.98-9945FF?style=flat-square&logo=solana)
- ![Wallet Adapter](https://img.shields.io/badge/Wallet_Adapter-0.15-9945FF?style=flat-square&logo=solana)
- ![Sanctum Gateway](https://img.shields.io/badge/Sanctum_Gateway-API-e5ff4a?style=flat-square)

### UI Components

- ![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-0.3-1b1718?style=flat-square)
- ![Poppins Font](https://img.shields.io/badge/Poppins-Font_Google-1b1718?style=flat-square)

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Sanctum Gateway API key (get one at [gateway.sanctum.so](https://gateway.sanctum.so))

### Installation

```bash
# Clone the repository
git clone https://github.com/DhanteyUD/Gateway_Gauntlet.git
cd Gateway_Gauntlet

# Install dependencies
npm install
# or
yarn install

# Configure environment variables
cp .env.local.example .env.local
```

### Environment Setup

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SANCTUM_API_KEY=your_api_key_here
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_GATEWAY_HOST_ADDRESS=your_solana_public_key
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🎓 What You'll Learn

By playing Gateway Gauntlet, you'll gain practical understanding of:

1. **Transaction Delivery Methods** - When to use RPC vs Jito bundles
2. **Cost Optimization** - Balancing fees with reliability requirements
3. **Network Congestion** - How to adapt strategies to changing conditions
4. **Fallback Mechanisms** - Why redundancy matters for critical transactions
5. **Gateway Features** - Leveraging Sanctum Gateway's advanced capabilities

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links & Resources

- **Live Demo** - [Gateway Gauntlet](https://your-deployment-url.vercel.app)
- **Sanctum Gateway** - [gateway.sanctum.so](https://gateway.sanctum.so)
- **Hackathon Submission** - [View Submission](#)

---

## 👏 Acknowledgments

- **Sanctum** for providing Gateway infrastructure and hosting the hackathon
- **Solana Foundation** for building an incredible blockchain ecosystem
- **The Solana Community** for continuous innovation and support

---

## 📧 Contact

**DhanteyUD** - [@DhanteyUD](https://github.com/DhanteyUD)

Project Link: [https://github.com/DhanteyUD/Gateway_Gauntlet](https://github.com/DhanteyUD/Gateway_Gauntlet)

---

<div align="center">

**Built with ❤️ for the Solana developer community**

*Making blockchain transaction optimization accessible through gamification*

**⭐ Star this repo if you find it useful!**

[![Powered by Sanctum Gateway](https://img.shields.io/badge/Powered_by-Sanctum_Gateway-e5ff4a?style=for-the-badge&logo=solana&logoColor=1b1718)](https://gateway.sanctum.so)

</div>
