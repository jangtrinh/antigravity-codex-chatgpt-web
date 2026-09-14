---
name: codex-chatgpt
description: "Leverage ChatGPT Web (Pro, Extra High, High, Medium, Light) or Codex Native (GPT-6-Astra) via the codex-chatgpt-web bridge for deep reasoning, system architecture, code generation, and independent code review with zero API token billing."
---

# Codex ChatGPT Web Skill

This skill enables Antigravity agents to harness the reasoning power of **ChatGPT Web (Pro / Plus)** and **Codex Native (GPT-6-Astra)** through the local `codex-chatgpt-web` background daemon (listening on port `17841`).

## When to Activate This Skill

- **Zero Token Cost Reasoning**: Tap into OpenAI's top-tier reasoning engines (ChatGPT Pro, GPT-6-Astra) without consuming OpenAI API credits.
- **Deep Architectural & Algorithmic Analysis**: Tackle complex distributed systems, formal proofs, or high-concurrency memory models using `pro` or `xhigh` tiers.
- **Independent Code Review & Generation**: Validate complex pull requests or generate unit test suites with native Codex (`astra` / `gpt-6-astra`).
- **Balanced or Rapid Problem Solving**: Get immediate answers using `light` or balanced reasoning with `medium` (default).

---

## Usage in Antigravity Sessions

### Method 1: Via MCP Tools (Recommended)

Antigravity automatically discovers the following MCP tools provided by `codex-chatgpt-web`:

1. **`ask_chatgpt_web`**:
   - `prompt`: Question or engineering problem sent to ChatGPT Web.
   - `model`: Target reasoning profile:
     - `chatgpt-web/pro` or `pro`: Maximum reasoning depth (O1/Pro engine).
     - `chatgpt-web/extra-high` or `xhigh`: Extremely deep algorithmic reasoning.
     - `chatgpt-web/high` or `high`: In-depth code reviews and architectural analysis.
     - `chatgpt-web/medium` or `medium`: Balanced speed and reasoning *(default)*.
     - `chatgpt-web/light` or `light`: Instant, low-latency response.
   - `cwd`: (Optional) Contextual working directory.

2. **`ask_codex_native`**:
   - `prompt`: Specialized coding or refactoring task for Codex Native.
   - `model`: Defaults to `gpt-6-astra`.
   - `cwd`: (Optional) Working directory for context.

---

### Method 2: Direct Terminal CLI (`codex-web`)

The bundled `codex-web` executable allows fast queries and shell piping:

```bash
# 1. Default query (Medium - balanced reasoning)
codex-web "Explain how Node.js event loop handles Microtasks vs Macrotasks"

# 2. Pro Mode for complex architectural system design
codex-web -m pro "Design an idempotent distributed payment webhook processor in Go"

# 3. Extra High / High for deep algorithmic problems
codex-web -m xhigh "Optimize real-time Traveling Salesperson with hard time windows"

# 4. Codex Native GPT-6-Astra for code generation
codex-web -m astra "Generate Jest unit tests with 100% branch coverage for auth.controller.ts"

# 5. Fast response (Light)
codex-web -m light "Convert this SQL schema into a Prisma schema"

# 6. Pipe file contents directly
cat schema.prisma | codex-web -m high "Review schema indexing and surface query performance risks"
```

---

## Model Comparison Matrix

| Model Tier | CLI / Tool Param | Speed | Reasoning Depth | Recommended Use Cases |
| :--- | :--- | :---: | :---: | :--- |
| **ChatGPT Pro** | `pro` / `chatgpt-web/pro` | Deliberate | **Maximum (O1/Pro)** | High-complexity system design, distributed consensus, abstract debugging |
| **ChatGPT Extra High** | `xhigh` / `chatgpt-web/extra-high` | Moderate | Very High | Advanced mathematical modeling, complex algorithmic optimizations |
| **ChatGPT High** | `high` / `chatgpt-web/high` | Moderate | High | Security audits, deep code reviews, database query plan optimization |
| **ChatGPT Medium** | `medium` / `chatgpt-web/medium` | Fast | Balanced *(Default)* | General programming, conceptual explanations, standard problem solving |
| **ChatGPT Light** | `light` / `chatgpt-web/light` | Blazing Fast | Standard | Syntax conversions, regex authoring, quick data reformatting |
| **Codex GPT-6-Astra** | `astra` / `gpt-6-astra` | Fast | High Code Specialization | Codex Native deep coding, AST refactoring, automated test generation |

---

## Troubleshooting

1. **Verify Bridge Health**:
   ```bash
   codex-web --status
   ```
2. **Port 17841 is OFFLINE**:
   - Verify the daemon is running locally (`lsof -i :17841`).
   - Start the bridge following `miuuyy/codex-chatgpt-web` instructions.
3. **Session Expired or Cloudflare Challenge**:
   - Open the browser controller window spawned by `codex-chatgpt-web` to refresh login credentials.
