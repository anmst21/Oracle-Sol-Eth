# Oracle

A cross-chain trading platform connecting Solana and Ethereum ecosystems. Swap, bridge, buy, and send crypto with instant Relay-powered fills and minimal gas fees.

**Live:** [oracleswap.app](https://oracleswap.app)

---

## Features

### Trading
- **Swap** — Cross-chain token swaps powered by Relay SDK with automatic route optimization and slippage control
- **Bridge** — Move assets between Solana, Ethereum, Base, Arbitrum, Polygon, Optimism, Zora, and Degen chains via Relay's relayer model
- **Buy** — Fiat on-ramp with MoonPay integration supporting multiple currencies and automatic geo-detection
- **Send** — Transfer tokens to any wallet across supported chains

### Discovery
- **Charts** — Interactive financial charts with historical price data, pool analytics, and trade history (Lightweight Charts)
- **Trending Tokens** — Real-time trending Solana tokens via DexScreener, Ethereum tokens via Dune/Sim, and Farcaster community tokens
- **Token Search** — Search across DEX pairs with detailed pool and market data from Gecko Terminal

### Content & Social
- **Blog** — CMS-managed articles with categories, authors, and rich text (Sanity)
- **Feed** — Social token feed with featured and following views
- **Newsletter** — Mailchimp-powered email subscriptions

### 3D Visualization
- **WebGPU ASCII Shader** — Three.js WebGPU rendering with TSL (Three Shading Language) for real-time ASCII art effects on interactive 3D models with drag controls

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | SCSS Modules, Motion (Framer Motion), Lottie, Anime.js |
| **Wallet Auth** | Privy (multi-chain), Wagmi, @solana/web3.js |
| **Swaps & Bridging** | Relay SDK, Relay Kit UI/Hooks |
| **On-Ramp** | MoonPay |
| **Data** | DexScreener, Gecko Terminal, Dune Analytics, Metaplex |
| **3D Graphics** | Three.js WebGPU, TSL, React Three Fiber |
| **Charts** | Lightweight Charts |
| **CMS** | Sanity |
| **State** | TanStack React Query, React Context |
| **Forms** | React Hook Form, reCAPTCHA v3 |
| **Email** | Nodemailer, Mailchimp, React Email |
| **UI** | Radix UI, Embla Carousel |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Yarn 4

### Setup

```bash
# Clone the repo
git clone https://github.com/anmst21/Oracle-Sol-Eth.git
cd Oracle-Sol-Eth

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env
# Fill in your API keys in .env

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

```bash
yarn dev       # Start dev server
yarn build     # Production build (standalone)
yarn start     # Start production server
yarn lint      # Run ESLint
yarn email     # Email template dev server
```

---

## Environment Variables

Copy `.env.example` and fill in your keys:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PRIVY_KEY` | Privy app key |
| `NEXT_PUBLIC_CLIENT_ID` | Privy client ID |
| `NEXT_PUBLIC_SOLANA_RPC` | Helius Solana RPC endpoint |
| `NEXT_PUBLIC_ETHEREUM_RPC` | Alchemy Ethereum RPC endpoint |
| `ALCHEMY_API_KEY` | Alchemy API key (multi-chain RPC) |
| `DUNE_API_KEY` | Dune Analytics API key |
| `SIM_API_KEY` | Sim by Dune API key |
| `NEXT_PUBLIC_DUNE_API_KEY` | Dune key (client-side) |
| `NEXT_PUBLIC_MOONPAY_API_KEY` | MoonPay publishable key |
| `MAILCHIMP_API_KEY` | Mailchimp API key |
| `MAILCHIMP_SERVER_PREFIX` | Mailchimp data center prefix |
| `MAILCHIMP_AUDIENCE_ID` | Mailchimp audience/list ID |
| `GMAIL_USER` | Gmail address for contact form |
| `GMAIL_PASS` | Gmail app password |
| `NEXT_PUBLIC_RECAPCHA_KEY` | reCAPTCHA v3 site key |
| `RECAPCHA_BACKEND_KEY` | reCAPTCHA v3 secret key |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (notifications) |
| `TELEGRAM_CHAT_ID` | Telegram chat ID |

---

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (exchange)/           # Trading routes (swap, buy, chart, history)
    blog/                 # Blog listing and [slug] posts
    coins/                # Token discovery (solana, ethereum, community)
    feed/                 # Social feed (featured, following)
    contacts/             # Contact form
    admin/                # Sanity Studio
  actions/                # Server actions (data fetching, forms)
  components/
    home-*/               # Landing page sections
    swap/                 # Swap interface
    buy/                  # MoonPay on-ramp
    chart/                # Financial charts
    coins/                # Token discovery UI
    wallets/              # Wallet connection modal
    header/               # Navigation
    token-modal/          # Token selection
  context/                # React context providers
  helpers/                # Utilities (RPC switching, formatters)
  types/                  # TypeScript declarations
public/
  objects/                # 3D GLB models
  images/                 # Static assets
  lottie/                 # Lottie animation files
```

---

## Deployment

The app is configured for standalone Next.js output, optimized for containerized deployments.

### Heroku

```bash
# Procfile is included
web: node .next/standalone/server.js
```

The `heroku-postbuild` script handles building and optimizing the slug.

---

## Supported Chains

- Solana
- Ethereum
- Base
- Arbitrum
- Polygon
- Optimism
- Zora
- Degen

---

## License

All rights reserved.
