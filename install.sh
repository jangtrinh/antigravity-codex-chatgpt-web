#!/usr/bin/env bash
# One-click installer for antigravity-codex-chatgpt-web bridge

set -eo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$HOME/.gemini/antigravity/bin"
SKILLS_DIR="$HOME/.gemini/config/skills/codex-chatgpt"
MCP_CONFIG="$HOME/.gemini/config/mcp_config.json"
MCP_SERVER_SCRIPT="$REPO_DIR/src/mcp-server.js"
BRIDGE_PORT=17841

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}  Antigravity <-> Codex ChatGPT Web Bridge Installer  ${NC}"
echo -e "${CYAN}======================================================${NC}"

# 1. Check prerequisites
echo -e "\n${BLUE}[1/5] Checking environment & prerequisites...${NC}"

if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Node.js is not installed or not in PATH. Please install Node.js >= 18.${NC}"
    exit 1
fi
echo -e "  ✓ Node.js version: $(node -v)"

if ! command -v codex >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING] 'codex' command was not found in PATH.${NC}"
    echo -e "    Make sure Codex CLI is installed and configured."
else
    echo -e "  ✓ Codex CLI: $(which codex)"
fi

# 2. Make scripts executable
echo -e "\n${BLUE}[2/5] Setting permissions...${NC}"
chmod +x "$REPO_DIR/bin/codex-web"
chmod +x "$REPO_DIR/src/mcp-server.js"
echo -e "  ✓ Permissions granted to bin/codex-web and src/mcp-server.js"

# 3. Install CLI binary into Antigravity bin directory
echo -e "\n${BLUE}[3/5] Installing CLI binary into Antigravity path...${NC}"
mkdir -p "$BIN_DIR"
ln -sf "$REPO_DIR/bin/codex-web" "$BIN_DIR/codex-web"
echo -e "  ✓ Linked $BIN_DIR/codex-web -> $REPO_DIR/bin/codex-web"

# 4. Install Antigravity Skill & MCP Schemas
echo -e "\n${BLUE}[4/6] Installing Antigravity Skill & MCP Schemas...${NC}"
mkdir -p "$SKILLS_DIR"
cp -f "$REPO_DIR/skills/codex-chatgpt/SKILL.md" "$SKILLS_DIR/SKILL.md"
echo -e "  ✓ Installed skill to $SKILLS_DIR/SKILL.md"

ANTIGRAVITY_MCP_DIR="$HOME/.gemini/antigravity/mcp/codex-chatgpt-web"
mkdir -p "$ANTIGRAVITY_MCP_DIR"
cp -rf "$REPO_DIR/mcp/"* "$ANTIGRAVITY_MCP_DIR/"
echo -e "  ✓ Installed MCP tool schemas to $ANTIGRAVITY_MCP_DIR"

# 5. Register MCP Server in mcp_config.json
echo -e "\n${BLUE}[5/6] Registering MCP server in $MCP_CONFIG...${NC}"
mkdir -p "$(dirname "$MCP_CONFIG")"

node -e "
const fs = require('fs');
const configPath = process.argv[1];
const serverScript = process.argv[2];

let config = { mcpServers: {} };
if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(raw);
    if (!config.mcpServers) config.mcpServers = {};
  } catch (e) {
    console.error('Warning: could not parse existing mcp_config.json, creating backup.');
    fs.copyFileSync(configPath, configPath + '.bak.' + Date.now());
  }
}

config.mcpServers['codex-chatgpt-web'] = {
  command: serverScript,
  args: [],
  env: {}
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
" "$MCP_CONFIG" "$MCP_SERVER_SCRIPT"

echo -e "  ✓ Registered 'codex-chatgpt-web' MCP server in $MCP_CONFIG"

# 6. Apply Bridge Optimizations (Image Generation & Completion Patch)
echo -e "\n${BLUE}[6/6] Applying Bridge Patches (Image Generation & Fast Completion)...${NC}"
if [ -f "$REPO_DIR/scripts/patch-bridge.js" ]; then
    node "$REPO_DIR/scripts/patch-bridge.js" || echo -e "${YELLOW}  ⚠ Notice: Bridge patch skipped or non-critical issue.${NC}"
fi

# Check bridge port connectivity
echo -e "\n${BLUE}--- Bridge Connectivity Check ---${NC}"
if nc -z -G 1 127.0.0.1 "$BRIDGE_PORT" 2>/dev/null || (echo > /dev/tcp/127.0.0.1/"$BRIDGE_PORT") >/dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Port $BRIDGE_PORT is ONLINE and reachable!${NC}"
else
    echo -e "  ${YELLOW}⚠ Port $BRIDGE_PORT is currently OFFLINE.${NC}"
    echo -e "    Start the codex-chatgpt-web bridge background service when ready."
fi

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}  Installation completed successfully!               ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "You can now run:"
echo -e "  ${CYAN}codex-web --help${NC}"
echo -e "  ${CYAN}codex-web -m pro \"Explain microservices architecture\"${NC}"
echo -e "Or use MCP tools ${CYAN}ask_chatgpt_web${NC} / ${CYAN}ask_codex_native${NC} inside Antigravity sessions."
