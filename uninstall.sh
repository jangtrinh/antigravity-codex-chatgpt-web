#!/usr/bin/env bash
# Uninstaller for antigravity-codex-chatgpt-web bridge

set -eo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

BIN_TARGET="$HOME/.gemini/antigravity/bin/codex-web"
SKILLS_DIR="$HOME/.gemini/config/skills/codex-chatgpt"
MCP_CONFIG="$HOME/.gemini/config/mcp_config.json"

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}  Antigravity <-> Codex ChatGPT Web Uninstaller       ${NC}"
echo -e "${CYAN}======================================================${NC}"

# 1. Remove CLI binary symlink
echo -e "\n${BLUE}[1/3] Removing CLI binary...${NC}"
if [ -e "$BIN_TARGET" ] || [ -L "$BIN_TARGET" ]; then
    rm -f "$BIN_TARGET"
    echo -e "  ✓ Removed $BIN_TARGET"
else
    echo -e "  - Binary link not found, skipping."
fi

# 2. Remove Skill and MCP directories
echo -e "\n${BLUE}[2/4] Removing Antigravity Skill & MCP Schemas...${NC}"
if [ -d "$SKILLS_DIR" ]; then
    rm -rf "$SKILLS_DIR"
    echo -e "  ✓ Removed $SKILLS_DIR"
else
    echo -e "  - Skill directory not found, skipping."
fi

ANTIGRAVITY_MCP_DIR="$HOME/.gemini/antigravity/mcp/codex-chatgpt-web"
if [ -d "$ANTIGRAVITY_MCP_DIR" ]; then
    rm -rf "$ANTIGRAVITY_MCP_DIR"
    echo -e "  ✓ Removed $ANTIGRAVITY_MCP_DIR"
else
    echo -e "  - MCP schema directory not found, skipping."
fi

# 3. Unregister from mcp_config.json
echo -e "\n${BLUE}[3/4] Unregistering MCP server from $MCP_CONFIG...${NC}"
if [ -f "$MCP_CONFIG" ]; then
    node -e "
const fs = require('fs');
const configPath = process.argv[1];

try {
  const raw = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(raw);
  if (config.mcpServers && config.mcpServers['codex-chatgpt-web']) {
    delete config.mcpServers['codex-chatgpt-web'];
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
    console.log('  ✓ Removed codex-chatgpt-web from mcp_config.json');
  } else {
    console.log('  - codex-chatgpt-web was not present in mcp_config.json');
  }
} catch (e) {
  console.error('  ⚠ Error reading mcp_config.json:', e.message);
}
" "$MCP_CONFIG"
else
    echo -e "  - mcp_config.json not found, skipping."
fi

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}  Uninstallation completed cleanly.                   ${NC}"
echo -e "${GREEN}======================================================${NC}"
