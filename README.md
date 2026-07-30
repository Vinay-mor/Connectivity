<p align="center">
  <img src="public/logos/logo.svg" alt="Connectivity Logo" width="80" height="80" />
</p>

<h1 align="center">⚡ Connectivity</h1>

<p align="center">
  <strong>AI-Powered Workflow Automation Platform</strong>
  <br />
  <em>Build · Connect · Automate — All in one visual canvas</em>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-✨-blueviolet?style=for-the-badge" alt="Features" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-🛠️-blue?style=for-the-badge" alt="Tech Stack" /></a>
  <a href="#-getting-started"><img src="https://img.shields.io/badge/Get_Started-🚀-green?style=for-the-badge" alt="Get Started" /></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-🏗️-orange?style=for-the-badge" alt="Architecture" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Inngest-Serverless-5647FF?style=flat-square" alt="Inngest" />
  <img src="https://img.shields.io/badge/tRPC-11-2596BE?style=flat-square&logo=trpc&logoColor=white" alt="tRPC" />
</p>

<br />

---

<br />

## 🎯 What is Connectivity?

**Connectivity** is a powerful, open-source workflow automation platform that lets you visually design, connect, and execute complex automation workflows — powered by AI.

Think of it as your personal **Zapier + n8n alternative**, but with a beautiful drag-and-drop canvas, AI-powered nodes, real-time execution monitoring, and a modern tech stack that developers love.

<br />

> ### 💡 Why Connectivity?
>
> Most automation tools are either **too complex** for quick setups or **too limited** for advanced workflows.
> Connectivity bridges the gap — giving you a **visual canvas** that's intuitive enough for beginners,
> yet powerful enough for developers to build production-grade automation.

<br />

---

<br />

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 Visual Workflow Editor
- Drag-and-drop canvas powered by **React Flow**
- Intuitive node-based interface
- Real-time connection drawing between nodes
- Auto-layout & topological sorting

</td>
<td width="50%">

### 🤖 AI-Powered Nodes
- **OpenAI** (GPT) integration
- **Anthropic** (Claude) integration
- **Google Gemini** integration
- Plug your own API keys securely

</td>
</tr>
<tr>
<td width="50%">

### ⚡ Smart Triggers
- **Manual Trigger** — run on demand
- **Google Form Trigger** — form submissions
- **Stripe Trigger** — payment events
- Webhook-based event listeners

</td>
<td width="50%">

### 🔗 Service Integrations
- **Discord** — send messages & notifications
- **Slack** — workspace automation
- **HTTP Request** — connect any REST API
- Extensible executor registry

</td>
</tr>
<tr>
<td width="50%">

### 📊 Execution Monitoring
- Real-time workflow execution tracking
- Success / Failure / Running status
- Detailed error stack traces
- Output inspection for each run

</td>
<td width="50%">

### 🔐 Auth & Security
- **Better Auth** authentication system
- Social logins (GitHub, Google)
- Encrypted credential storage via **Cryptr**
- Session management with secure tokens

</td>
</tr>
<tr>
<td width="50%">

### 💳 Subscriptions & Billing
- **Polar.sh** integration for payments
- Tiered subscription plans
- Usage-based access control
- Upgrade modals & gating

</td>
<td width="50%">

### 🛡️ Production-Ready
- **Sentry** error monitoring & tracing
- Type-safe API layer with **tRPC**
- Background job orchestration via **Inngest**
- Retry logic with configurable strategies

</td>
</tr>
</table>

<br />

---

<br />

## 🛠️ Tech Stack

<table>
<tr>
<th align="center">Layer</th>
<th align="center">Technology</th>
<th align="center">Purpose</th>
</tr>
<tr>
<td><strong>⚛️ Framework</strong></td>
<td>Next.js 16 (App Router)</td>
<td>Full-stack React framework with SSR/SSG</td>
</tr>
<tr>
<td><strong>🎨 Frontend</strong></td>
<td>React 19, TailwindCSS 4, Radix UI, shadcn/ui</td>
<td>Modern, accessible UI components</td>
</tr>
<tr>
<td><strong>📊 State</strong></td>
<td>Jotai, TanStack React Query, Nuqs</td>
<td>Atomic state, server state, URL state</td>
</tr>
<tr>
<td><strong>🔌 API</strong></td>
<td>tRPC 11, Zod 4</td>
<td>End-to-end type-safe API with validation</td>
</tr>
<tr>
<td><strong>🗄️ Database</strong></td>
<td>PostgreSQL, Prisma 6</td>
<td>Relational data modeling & ORM</td>
</tr>
<tr>
<td><strong>🔐 Auth</strong></td>
<td>Better Auth, Cryptr</td>
<td>Authentication & encrypted credentials</td>
</tr>
<tr>
<td><strong>⚡ Background Jobs</strong></td>
<td>Inngest</td>
<td>Durable workflow execution & retries</td>
</tr>
<tr>
<td><strong>🤖 AI SDKs</strong></td>
<td>Vercel AI SDK (OpenAI, Anthropic, Google)</td>
<td>Multi-provider AI model integration</td>
</tr>
<tr>
<td><strong>🧩 Canvas</strong></td>
<td>React Flow (@xyflow/react)</td>
<td>Visual node-based workflow editor</td>
</tr>
<tr>
<td><strong>💳 Payments</strong></td>
<td>Polar.sh SDK</td>
<td>Subscription billing & checkout</td>
</tr>
<tr>
<td><strong>📈 Monitoring</strong></td>
<td>Sentry</td>
<td>Error tracking & performance monitoring</td>
</tr>
<tr>
<td><strong>📝 Forms</strong></td>
<td>React Hook Form, Zod Resolvers</td>
<td>Validated form handling</td>
</tr>
</table>

<br />

---

<br />

## 🏗️ Architecture

```
connectivity/
├── 📂 prisma/                    # Database schema & migrations
│   ├── schema.prisma             # Data models (User, Workflow, Node, etc.)
│   └── migrations/               # Database migration history
│
├── 📂 src/
│   ├── 📂 app/                   # Next.js App Router
│   │   ├── (auth)/               # Authentication pages (sign-in, sign-up)
│   │   ├── (dashboard)/          # Protected dashboard
│   │   │   ├── (editor)/         # Visual workflow editor canvas
│   │   │   └── (rest)/           # Workflows, Credentials, Executions pages
│   │   └── api/                  # API routes (tRPC, auth, webhooks)
│   │
│   ├── 📂 features/              # Feature-based modules
│   │   ├── auth/                 # Authentication logic & UI
│   │   ├── credentials/          # API key management (encrypted)
│   │   ├── editor/               # Canvas editor (React Flow)
│   │   ├── executions/           # Workflow execution engine
│   │   │   ├── components/       # Node executors (HTTP, AI, Discord, etc.)
│   │   │   └── lib/              # Executor registry & types
│   │   ├── subscriptions/        # Billing & plan management
│   │   ├── triggers/             # Event triggers (Manual, Google Forms, Stripe)
│   │   └── workflows/            # Workflow CRUD & management
│   │
│   ├── 📂 inngest/               # Background job orchestration
│   │   ├── functions.ts          # Workflow execution pipeline
│   │   ├── channels/             # Real-time streaming channels
│   │   └── utils.ts              # Topological sort & helpers
│   │
│   ├── 📂 components/            # Shared UI components
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── app-sidebar.tsx       # Navigation sidebar
│   │   ├── node-selector.tsx     # Node type picker
│   │   └── workflow-node.tsx     # Custom React Flow node
│   │
│   ├── 📂 trpc/                  # tRPC configuration
│   ├── 📂 hooks/                 # Custom React hooks
│   ├── 📂 lib/                   # Utilities & shared logic
│   └── 📂 config/                # App configuration
│
├── 📂 public/
│   └── logos/                    # Service logos & branding assets
│
├── 📄 next.config.ts             # Next.js + Sentry configuration
├── 📄 mprocs.yaml                # Multi-process dev runner
└── 📄 package.json               # Dependencies & scripts
```

<br />

### 🔄 Workflow Execution Pipeline

```mermaid
graph LR
    A["🎯 Trigger Event"] --> B["📋 Create Execution"]
    B --> C["🔀 Topological Sort"]
    C --> D["⚡ Execute Nodes"]
    D --> E{"✅ Success?"}
    E -->|Yes| F["💾 Save Output"]
    E -->|No| G["🔄 Retry / ❌ Fail"]
    G --> D
    F --> H["📊 Update Status"]
    G --> H
```

<br />

### 🧠 How It Works

1. **Design** — Drag nodes onto the canvas and draw connections between them
2. **Configure** — Set up each node with the right parameters and credentials
3. **Trigger** — Start workflows manually or via external events (webhooks, form submissions, payments)
4. **Execute** — Inngest orchestrates node-by-node execution in topological order
5. **Monitor** — Track real-time status, inspect outputs, and debug failures

<br />

---

<br />

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|------------|---------|
| **Node.js** | v20+ |
| **npm** | v10+ |
| **PostgreSQL** | v15+ |

<br />

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Vinay-mor/Connectivity.git
cd Connectivity
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the root directory:

```env
# ─── Database ───────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/connectivity"

# ─── Authentication ─────────────────────────────
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# ─── AI Providers (add the ones you need) ───────
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_GENERATIVE_AI_API_KEY="AIza..."

# ─── Integrations ───────────────────────────────
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# ─── Payments (Polar.sh) ────────────────────────
POLAR_ACCESS_TOKEN="your-polar-token"

# ─── Encryption ─────────────────────────────────
ENCRYPTION_KEY="your-32-char-encryption-key"

# ─── Sentry (Optional) ─────────────────────────
SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="sntrys_..."
```

### 4️⃣ Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view your data
npx prisma studio
```

### 5️⃣ Start the development server

```bash
# Start everything (Next.js + Inngest dev server)
npm run dev:all
```

Or run services individually:

```bash
# Terminal 1 — Next.js
npm run dev

# Terminal 2 — Inngest Dev Server
npm run inngest:dev
```

### 6️⃣ Open the app

```
🌐 App:         http://localhost:3000
⚡ Inngest:     http://localhost:8288
```

<br />

---

<br />

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run dev:all` | Start all services (Next.js + Inngest) via mprocs |
| `npm run build` | Generate Prisma client & build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run inngest:dev` | Start the Inngest dev server |
| `npm run ngrok:dev` | Expose local server via ngrok (for webhooks) |

<br />

---

<br />

## 🧩 Supported Nodes

<table>
<tr>
<th align="center">Category</th>
<th align="center">Node</th>
<th align="center">Description</th>
</tr>
<tr>
<td rowspan="3"><strong>🎯 Triggers</strong></td>
<td>⏱️ Manual Trigger</td>
<td>Execute workflow on demand</td>
</tr>
<tr>
<td>📋 Google Form Trigger</td>
<td>Run on form submission</td>
</tr>
<tr>
<td>💳 Stripe Trigger</td>
<td>React to payment events</td>
</tr>
<tr>
<td rowspan="3"><strong>🤖 AI</strong></td>
<td>🧠 OpenAI</td>
<td>GPT models for text generation</td>
</tr>
<tr>
<td>💎 Anthropic</td>
<td>Claude models for reasoning</td>
</tr>
<tr>
<td>✨ Gemini</td>
<td>Google's multimodal AI</td>
</tr>
<tr>
<td rowspan="3"><strong>🔗 Integrations</strong></td>
<td>💬 Discord</td>
<td>Send messages & embeds</td>
</tr>
<tr>
<td>📢 Slack</td>
<td>Post to channels & threads</td>
</tr>
<tr>
<td>🌐 HTTP Request</td>
<td>Call any REST API endpoint</td>
</tr>
</table>

<br />

---

<br />

## 🗄️ Database Schema

The data model is designed around **users**, **workflows**, and **executions**:

```mermaid
erDiagram
    USER ||--o{ WORKFLOW : creates
    USER ||--o{ CREDENTIAL : stores
    USER ||--o{ SESSION : has
    USER ||--o{ ACCOUNT : links

    WORKFLOW ||--o{ NODE : contains
    WORKFLOW ||--o{ CONNECTION : has
    WORKFLOW ||--o{ EXECUTION : runs

    NODE ||--o{ CONNECTION : "connects from"
    NODE ||--o{ CONNECTION : "connects to"
    NODE }o--|| CREDENTIAL : "uses"

    USER {
        string id PK
        string name
        string email
        boolean emailVerified
        string image
    }

    WORKFLOW {
        string id PK
        string name
        string userId FK
        datetime createdAt
    }

    NODE {
        string id PK
        string name
        enum type
        json position
        json data
        string workflowId FK
        string credentialId FK
    }

    CONNECTION {
        string id PK
        string fromNodeId FK
        string toNodeId FK
        string fromOutput
        string toInput
    }

    EXECUTION {
        string id PK
        enum status
        string error
        json output
        datetime startedAt
        datetime completedAt
        string inngestEventId
    }

    CREDENTIAL {
        string id PK
        string name
        string value
        enum type
        string userId FK
    }
```

<br />

---

<br />

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

<br />

### 📝 Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting, etc.) |
| `refactor:` | Code restructuring |
| `perf:` | Performance improvements |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

<br />

---

<br />

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br />

---

<br />

<p align="center">

  **Built with ❤️ by [Vinay Mor](https://github.com/Vinay-mor)**

</p>

<p align="center">
  <a href="https://github.com/Vinay-mor/Connectivity/stargazers">
    <img src="https://img.shields.io/github/stars/Vinay-mor/Connectivity?style=social" alt="Stars" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Vinay-mor/Connectivity/network/members">
    <img src="https://img.shields.io/github/forks/Vinay-mor/Connectivity?style=social" alt="Forks" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Vinay-mor/Connectivity/issues">
    <img src="https://img.shields.io/github/issues/Vinay-mor/Connectivity?style=social" alt="Issues" />
  </a>
</p>

<p align="center">
  <sub>If you found this project helpful, please consider giving it a ⭐</sub>
</p>
