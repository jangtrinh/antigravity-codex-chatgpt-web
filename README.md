# Antigravity <-> Codex ChatGPT Web Bridge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Protocol: MCP](https://img.shields.io/badge/Protocol-MCP%202024--11--05-blue.svg)](https://modelcontextprotocol.io/)
[![Zero External Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)](#)

> Seamless bridge connecting **Google DeepMind Antigravity** coding agent to **ChatGPT Web (Pro, Extra High, High, Medium, Light)** and **Codex Native (GPT-6-Astra)** via the [`miuuyy/codex-chatgpt-web`](https://github.com/miuuyy/codex-chatgpt-web) local service.

---

## 🌐 Language Navigation / Chọn Ngôn Ngữ
- [English Documentation](#-english-documentation)
- [Tài Liệu Tiếng Việt](#-tài-liệu-tiếng-việt)

---

# 🇬🇧 English Documentation

## Overview

`antigravity-codex-chatgpt-web` is a production-grade, zero-dependency bridge allowing **Google DeepMind Antigravity** agents to interact directly with your **ChatGPT Web (Pro / Plus)** subscription and **Codex Native** without incurring OpenAI API token costs.

### Key Highlights
- **Zero API Token Billing**: Leverages existing ChatGPT Web subscriptions.
- **Full Model Spectrum**: Supports `pro` (maximum reasoning depth), `extra-high`, `high`, `medium` (default), `light` (instant responses), and `gpt-6-astra` (Codex native coding).
- **Dual Interface**:
  - **MCP Server** (`src/mcp-server.js`): Fully conforms to the Model Context Protocol JSON-RPC standard for seamless Antigravity agent integration.
  - **CLI Helper** (`bin/codex-web`): Ergonomic terminal CLI with pipe support (`cat file | codex-web -m pro`).
- **Antigravity Skill**: Complete skill package (`skills/codex-chatgpt/SKILL.md`) for autonomous agent reasoning and code reviews.
- **Zero External Dependencies**: Pure Node.js built-ins (`child_process`, `readline`, `fs`, `path`).

---

## Architecture

```mermaid
graph TD
    subgraph AntigravityAgent ["Google DeepMind Antigravity"]
        AgentCore["Antigravity Agent Runtime"]
        Skill["Skill: codex-chatgpt"]
        AgentCore --> Skill
    end

    subgraph IntegrationSurface ["Bridge Interfaces"]
        MCPServer["MCP Server (JSON-RPC stdio)<br/><code>src/mcp-server.js</code>"]
        CLIWrapper["CLI Wrapper<br/><code>bin/codex-web</code>"]
    end

    subgraph CodexRuntime ["Local Codex Host"]
        CodexCLI["Codex CLI (exec --ephemeral)"]
        Bridge["codex-chatgpt-web Bridge<br/>(Port 17841)"]
    end

    subgraph TargetServices ["OpenAI Services"]
        ChatGPTWeb["ChatGPT Web<br/>(Pro / High / Med / Light)"]
        CodexNative["Codex Native Engine<br/>(GPT-6-Astra)"]
    end

    Skill -->|"MCP Tools (ask_chatgpt_web, ask_codex_native)"| MCPServer
    MCPServer --> CodexCLI
    CLIWrapper --> CodexCLI
    CodexCLI --> Bridge
    Bridge -->|"Browser Automation"| ChatGPTWeb
    Bridge -->|"Native Protocol"| CodexNative
```

---

## Model Comparison Matrix

| Model Alias | Target Identifier | Speed | Reasoning Depth | Recommended Use Cases |
| :--- | :--- | :---: | :---: | :--- |
| **`pro`** | `chatgpt-web/pro` | Slow | **Maximum (O1/Pro)** | High-complexity architecture design, formal proofs, multi-system tradeoffs |
| **`xhigh`** | `chatgpt-web/extra-high` | Moderate | Very High | Advanced mathematical modeling, complex algorithmic optimizations |
| **`high`** | `chatgpt-web/high` | Moderate | High | In-depth code reviews, database indexing strategies, security audits |
| **`medium`** | `chatgpt-web/medium` | Fast | Balanced *(Default)* | General programming queries, explanations, everyday problem solving |
| **`light`** | `chatgpt-web/light` | Blazing Fast | Standard | Data reformatting, regex authoring, quick syntax conversions |
| **`astra`** | `gpt-6-astra` | Fast | High Code Specialization | Codex Native deep coding, comprehensive unit test generation, AST refactors |

---

## Quick Installation (1-Step)

Clone or enter the directory and run the one-click installer:

```bash
cd /Users/jang/Products/antigravity-codex-chatgpt-web
./install.sh
```

What the installer does automatically:
1. Verifies Node.js (>= 18), `codex` CLI, and port `17841`.
2. Makes scripts executable (`chmod +x`).
3. Symlinks `bin/codex-web` into `~/.gemini/antigravity/bin/codex-web`.
4. Installs the skill into `~/.gemini/config/skills/codex-chatgpt/SKILL.md`.
5. Registers the MCP Server in `~/.gemini/config/mcp_config.json`.

---

## Usage

### 1. Terminal CLI (`codex-web`)

```bash
# Check connectivity and service health
codex-web --status

# Quick query with balanced medium model
codex-web "Explain how Node.js event loop handles Microtasks vs Macrotasks"

# Query with Pro model for complex system design
codex-web -m pro "Design an idempotent distributed payment webhook processor in Go"

# Query Codex Native for code generation
codex-web -m astra "Generate Jest tests with 100% coverage for auth.controller.ts"

# Pipe file content directly into codex-web
cat src/database.ts | codex-web -m high "Find concurrency bottlenecks and suggest fixes"
```

### 2. Antigravity MCP Tools

Within Antigravity sessions, the agent will have direct access to:

#### Tool: `ask_chatgpt_web`
```json
{
  "prompt": "Evaluate this architectural migration from REST to gRPC",
  "model": "chatgpt-web/pro"
}
```

#### Tool: `ask_codex_native`
```json
{
  "prompt": "Implement a lock-free ring buffer in Rust",
  "model": "gpt-6-astra"
}
```

---

## Troubleshooting

- **Port 17841 is OFFLINE**:
  The `codex-chatgpt-web` background daemon must be active. Run:
  ```bash
  codex-web --status
  ```
  If offline, ensure the service is running (`lsof -i :17841`).
- **Session Expired / Cloudflare Challenge**:
  Open the browser controller window spawned by `codex-chatgpt-web` to refresh login session credentials.

---

## Uninstallation

To cleanly remove the bridge, symlinks, skill, and MCP registration:

```bash
./uninstall.sh
```

---

# 🇻🇳 Tài Liệu Tiếng Việt

## Tổng Quan

`antigravity-codex-chatgpt-web` là gói cầu nối hoàn chỉnh, độc lập và tối ưu cao giúp agent **Antigravity (Google DeepMind)** khai thác trực tiếp gói tài khoản **ChatGPT Web (Pro / Plus)** và **Codex Native** thông qua dịch vụ cục bộ [`miuuyy/codex-chatgpt-web`](https://github.com/miuuyy/codex-chatgpt-web).

### Ưu Điểm Vượt Trội
- **0 chi phí token API**: Tận dụng gói đăng ký ChatGPT Web sẵn có.
- **Đa dạng model**: Hỗ trợ đầy đủ từ `pro` (suy luận siêu sâu), `xhigh`, `high`, `medium` (mặc định), `light` (phản hồi tức thì) đến `astra` (`gpt-6-astra` chuyên biệt coding).
- **Hai phương thức kết nối tiện lợi**:
  - **MCP Server chuẩn JSON-RPC** (`src/mcp-server.js`): Tích hợp trực tiếp vào Antigravity (`mcp_config.json`).
  - **CLI `codex-web`** (`bin/codex-web`): Gọi trực tiếp từ Terminal hoặc shell script, hỗ trợ pipe dữ liệu.
- **Skill Antigravity chuyên nghiệp**: `skills/codex-chatgpt/SKILL.md` sẵn sàng cho Antigravity tự động kích hoạt khi giải quyết các bài toán khó.
- **Không phụ thuộc thư viện ngoài (Zero Dependency)**: Hoạt động hoàn toàn bằng Node.js built-in module.

---

## Cài Đặt 1 Bước Siêu Tốc

Chỉ cần chạy script cài đặt tự động:

```bash
cd /Users/jang/Products/antigravity-codex-chatgpt-web
./install.sh
```

Script sẽ tự động:
1. Kiểm tra môi trường Node.js, lệnh `codex`, cổng `17841`.
2. Phân quyền thực thi file.
3. Tạo liên kết `codex-web` vào `~/.gemini/antigravity/bin/`.
4. Cài đặt Skill vào `~/.gemini/config/skills/codex-chatgpt/`.
5. Đăng ký MCP Server vào `~/.gemini/config/mcp_config.json`.

---

## Hướng Dẫn Sử Dụng

### 1. Sử dụng qua dòng lệnh (`codex-web`)

```bash
# Kiểm tra tình trạng kết nối tới bridge
codex-web --status

# Hỏi nhanh với model cân bằng mặc định (Medium)
codex-web "Tóm tắt 5 nguyên lý SOLID trong thiết kế phần mềm"

# Sử dụng model Pro cho bài toán tư duy/thiết kế kiến trúc hệ thống
codex-web -m pro "Thiết kế kiến trúc hệ thống Livestreaming chịu tải 500k CCU"

# Sử dụng Codex Native GPT-6-Astra chuyên viết mã
codex-web -m astra "Viết service quản lý giao dịch ngân hàng bằng TypeScript với NestJS"

# Pipe file mã nguồn trực tiếp vào dòng lệnh
cat src/auth.ts | codex-web -m high "Rà soát lỗ hổng bảo mật và đề xuất bản vá"
```

### 2. Sử dụng bên trong phiên Antigravity

Antigravity có thể trực tiếp gọi các công cụ:
- `ask_chatgpt_web`: Nhận các tham số `prompt`, `model` (`pro`, `high`, `medium`, `light`).
- `ask_codex_native`: Nhận các tham số `prompt`, `model` (`gpt-6-astra`).

---

## Xử Lý Sự Cố Thường Gặp

- **Lỗi cổng 17841 báo OFFLINE:**
  Kiểm tra dịch vụ background bridge bằng lệnh:
  ```bash
  codex-web --status
  ```
  Nếu chưa chạy, hãy khởi động bridge theo hướng dẫn `codex-chatgpt-web serve`.
- **Hết hạn phiên ChatGPT Web:**
  Truy cập cửa sổ trình duyệt quản lý của bridge để đăng nhập lại tài khoản ChatGPT.

---

## Gỡ Cài Đặt

Khi không còn nhu cầu sử dụng, chạy script gỡ bỏ sạch sẽ:

```bash
./uninstall.sh
```

---

## License

Dự án phát hành theo giấy phép [MIT](LICENSE). Bản quyền (c) 2026 Jang.
