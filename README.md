# 🌸 Bloom Supporter Identity

**Discover your crypto supporter personality—straight from your conversation.**

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/unicornbloom/bloom-identity-skill)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-green)](https://openclaw.ai)
[![ClawHub](https://img.shields.io/badge/ClawHub-Published-purple)](https://clawhub.ai/skills/bloom)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

---

## 🎯 What Is This?

**Bloom Supporter Identity** reveals your crypto supporter archetype through conversation analysis.

Are you a **Visionary** who backs bold ideas early? An **Explorer** discovering new ecosystems? A **Cultivator** building communities? An **Optimizer** refining what works? Or an **Innovator** pushing boundaries?

Find out in seconds. No wallet signatures. No Twitter auth. Just conversation intelligence.

---

## ⚡️ Quick Start

### For OpenClaw Users

```bash
/bloom
```

That's it. Get your supporter identity in ~3 seconds.

### For Developers

```bash
# Clone and install
git clone https://github.com/unicornbloom/bloom-identity-skill.git
cd bloom-identity-skill
npm install

# Set up environment
cp .env.example .env
# Edit .env with your keys

# Run analysis
npx tsx scripts/run-from-session.ts \
  ~/.openclaw/agents/main/sessions/<SessionId>.jsonl \
  <userId>
```

---

## 🌟 Why Bloom Supporter Identity?

### For Early Adopters
Finally, a way to prove you were there first—not through wallet history, but through **conviction**. Your supporter card shows what you care about and why you back it.

### For Builders
Discover users' supporter types to:
- Design better incentives
- Match users with relevant opportunities
- Build communities around shared values

### For Communities
Segment supporters by archetype:
- Rally **Visionaries** for bold launches
- Activate **Cultivators** for community growth
- Engage **Optimizers** for feedback loops

---

## 📊 The 5 Supporter Types

| Type | Tagline | Dimensions | Archetype |
|------|---------|------------|-----------|
| 💜 **Visionary** | First to back what's next | High conviction, High intuition | Backs bold ideas early |
| 🔵 **Explorer** | Discovers new frontiers | Low conviction, High intuition | Experiments widely |
| 💚 **Cultivator** | Builds lasting communities | Low conviction, Low intuition | Nurtures ecosystems |
| 🟡 **Optimizer** | Refines what works | High conviction, Low intuition | Doubles down on winners |
| 🔴 **Innovator** | Pushes boundaries | Balanced dimensions | Combines conviction + discovery |

---

## 🎁 What You Get

Your personalized **Bloom Supporter Identity Card** includes:

- **🎴 Supporter Type** – Your archetype (Visionary, Explorer, etc.)
- **💬 Custom Tagline** – A one-liner that captures your style
- **📊 2x2 Dimensions** – Conviction vs. Intuition scores
- **🏷️ Top Categories** – AI Tools, DeFi, NFTs, DAOs—where you focus
- **🎯 Skill Recommendations** – Top 5 OpenClaw skills matched to your profile
- **🔗 Shareable Dashboard** – Show off your identity on-chain
- **🤖 Agent Wallet** – Ready for X402 payments (Coinbase CDP on Base)

---

## 🚀 How It Works

### 1. Conversation Analysis
We analyze your last ~120 messages in OpenClaw to understand:
- **What excites you** (AI? DeFi? Governance?)
- **How you engage** (deep dives vs. quick experiments)
- **Your supporter archetype** (first-in or wait-and-see?)

### 2. Supporter Type Detection
Using a 2x2 framework (Conviction × Intuition), we map you to one of 5 archetypes:
- **Visionary**: High conviction + High intuition
- **Explorer**: Low conviction + High intuition
- **Cultivator**: Low conviction + Low intuition
- **Optimizer**: High conviction + Low intuition
- **Innovator**: Balanced (crosses quadrants)

### 3. Personalized Recommendations
We match your profile against OpenClaw skills on ClawHub, ranking by:
- Category alignment (your interests × skill categories)
- Supporter type fit (Visionaries → bold experimental tools)
- Engagement patterns (deep research → complex tooling)

### 4. Identity Card Generation
You get:
- A shareable dashboard URL
- An on-chain agent wallet (Base network)
- A JSON token signed with JWT for verification

**No wallet signatures. No Twitter auth. No transaction scraping.**
Pure conversation intelligence.

---

## 🔧 Installation

### Option 1: ClawHub (Recommended)

```bash
clawhub install bloom
```

### Option 2: Manual Install

```bash
# 1. Clone the repo
cd ~/.openclaw/workspace
git clone https://github.com/unicornbloom/bloom-identity-skill.git
cd bloom-identity-skill

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your JWT_SECRET, DASHBOARD_URL, etc.

# 4. Copy skill wrapper to OpenClaw
cp -r openclaw-wrapper ~/.openclaw/skills/bloom

# 5. Test it
/bloom
```

---

## 📖 Usage

### As an OpenClaw Skill

```bash
/bloom
```

Or use natural language:
```
"discover my supporter type"
"what's my bloom identity"
"create my supporter card"
```

### As a Standalone Tool

#### From session file (full context)
```bash
npx tsx scripts/run-from-session.ts \
  ~/.openclaw/agents/main/sessions/<SessionId>.jsonl \
  telegram:123456
```

#### From piped conversation
```bash
cat conversation.txt | \
  npx tsx scripts/run-from-context.ts --user-id telegram:123456
```

---

## 🔐 Privacy

- ✅ **Conversation-only analysis** – No wallet signatures or transaction scraping
- ✅ **No Twitter auth required** – Optional enhancement, not mandatory
- ✅ **Ephemeral processing** – Data not stored long-term
- ✅ **Local-first** – Runs in your OpenClaw environment
- ✅ **Open source** – Audit the code yourself

---

## 🛠 Configuration

### Environment Variables

```bash
# Required
JWT_SECRET=your_secret_key_here
DASHBOARD_URL=https://bloomprotocol.ai

# Optional (for real agent wallet creation)
CDP_API_KEY_ID=your_coinbase_key
CDP_API_KEY_SECRET=your_coinbase_secret
NETWORK=base-mainnet  # or base-sepolia
```

### Advanced Options

See [SETUP_CDP_CREDENTIALS.md](SETUP_CDP_CREDENTIALS.md) for Coinbase CDP setup.
See [SESSION-READER-GUIDE.md](SESSION-READER-GUIDE.md) for session file analysis.

---

## 🧪 Testing

```bash
# Run full test suite
npm test

# Test with real session data
npx tsx scripts/run-from-session.ts \
  ~/.openclaw/agents/main/sessions/<SessionId>.jsonl \
  test-user-123

# Test end-to-end flow
npx tsx scripts/test-full-flow.ts
```

---

## 📊 Technical Details

| Feature | Details |
|---------|---------|
| **Version** | 2.0.0 |
| **Analysis Engine** | Conversation memory + category mapping |
| **Session Context** | Last ~120 messages (~5KB) |
| **Processing Time** | ~2-5 seconds |
| **Output Format** | Structured text + shareable dashboard URL |
| **Agent Wallet** | Coinbase CDP (Base network) |
| **Supported Platforms** | OpenClaw, CLI, API |

---

## 🐛 Troubleshooting

**"Insufficient conversation data"**
→ Need at least 3 messages. Keep chatting about what you're interested in!

**"Command not found"**
→ Verify `bloom-identity-skill` is in `~/.openclaw/workspace/` and run `npm install`

**No skill recommendations**
→ Skill recommendations depend on ClawHub API availability. Your identity card still works!

**Wallet creation fails**
→ Check your CDP credentials in `.env`. See [SETUP_CDP_CREDENTIALS.md](SETUP_CDP_CREDENTIALS.md).

---

## 📚 Documentation

- [Installation Guide](SESSION-READER-GUIDE.md)
- [OpenClaw Integration](openclaw-wrapper/SKILL.md)
- [CDP Wallet Setup](SETUP_CDP_CREDENTIALS.md)
- [Frontend Implementation](FRONTEND-IMPLEMENTATION-GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)

---

## 🤝 Contributing

We welcome contributions! See issues or submit PRs.

Key areas:
- More supporter type archetypes
- Better skill recommendation algorithms
- Multilingual support
- Enhanced privacy features

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🌐 Links

- **Homepage**: [bloomprotocol.ai](https://bloomprotocol.ai)
- **ClawHub**: [clawhub.ai/skills/bloom](https://clawhub.ai/skills/bloom)
- **GitHub**: [github.com/unicornbloom/bloom-identity-skill](https://github.com/unicornbloom/bloom-identity-skill)
- **Dashboard**: [bloomprotocol.ai/agents](https://bloomprotocol.ai/agents)

---

**Built by [Bloom Protocol](https://bloomprotocol.ai) 🌸**

Making supporter identity portable and provable.

*Built with [@openclaw](https://openclaw.ai), [@coinbase](https://www.coinbase.com/cloud), and [@base](https://base.org)*
