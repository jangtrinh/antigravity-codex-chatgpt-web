#!/usr/bin/env node

/**
 * Terminal session simulator for Antigravity <-> Codex ChatGPT Web Bridge Demo
 * Displays Antigravity agent querying ChatGPT Web Pro via the codex-chatgpt-web MCP server.
 * Entire output in English.
 */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  brightGreen: "\x1b[92m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
  bgDark: "\x1b[48;5;236m",
  bgBlue: "\x1b[44m",
};

async function printSlow(text, charDelay = 18) {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(charDelay);
  }
  process.stdout.write("\n");
}

async function showSpinner(text, durationMs = 1500) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const start = Date.now();
  let i = 0;
  while (Date.now() - start < durationMs) {
    process.stdout.write(`\r${c.yellow}${frames[i++ % frames.length]}${c.reset} ${text}`);
    await sleep(80);
  }
  process.stdout.write(`\r\x1b[K${c.green}✔${c.reset} ${text}\n`);
}

async function main() {
  // Step 1: Health check command
  process.stdout.write(`\n${c.bold}${c.green}user@macbook${c.reset}:${c.blue}~/antigravity-codex-chatgpt-web${c.reset}$ `);
  await sleep(400);
  await printSlow("codex-web --status", 28);
  await sleep(300);

  console.log(`${c.bold}${c.cyan}=== Codex ChatGPT Web Bridge Status ===${c.reset}`);
  console.log(`1. 'codex' command: ${c.green}OK${c.reset} ${c.gray}(/opt/homebrew/bin/codex)${c.reset}`);
  console.log(`2. Bridge port:     ${c.green}${c.bold}ONLINE${c.reset} ${c.gray}(127.0.0.1:17841)${c.reset}`);

  await sleep(600);

  // Step 2: Run Antigravity CLI session
  process.stdout.write(`\n${c.bold}${c.green}user@macbook${c.reset}:${c.blue}~/antigravity-codex-chatgpt-web${c.reset}$ `);
  await sleep(300);
  await printSlow('agy "Ask ChatGPT Web Pro to optimize worker pool with Atomics"', 22);
  await sleep(400);

  console.log(`${c.bold}${c.brightCyan}▲ DeepMind Antigravity Agent${c.reset} ${c.gray}v1.2.2 [Session #8f5-945a]${c.reset}`);
  console.log(`${c.dim}● Workspace:  ${c.reset}/Users/jang/Products/antigravity-codex-chatgpt-web`);
  console.log(`${c.dim}● MCP Server: ${c.reset}${c.green}codex-chatgpt-web${c.reset} ${c.gray}(port 17841 • stdio)${c.reset}`);
  console.log(`${c.dim}● Loaded Tool:${c.reset} ${c.cyan}ask_chatgpt_web${c.reset}, ${c.cyan}ask_codex_native${c.reset}`);

  await sleep(400);

  console.log(`\n${c.bold}${c.blue}▸ [Antigravity]${c.reset} Routing prompt to MCP tool: ${c.cyan}${c.bold}ask_chatgpt_web${c.reset}`);
  console.log(`  ${c.gray}→ Target reasoning model: ${c.yellow}${c.bold}chatgpt-web/pro${c.reset}`);
  console.log(`  ${c.gray}→ Forwarding payload to local bridge (127.0.0.1:17841)...${c.reset}`);

  await sleep(400);
  await showSpinner(`${c.dim}ChatGPT Web Pro is analyzing memory fencing & CAS throughput...${c.reset}`, 1800);
  await sleep(200);

  console.log(`${c.bgDark}${c.brightGreen}${c.bold} [ChatGPT Web Pro Response • 0 API Tokens Billed] ${c.reset}`);

  const responseLines = [
    `${c.bold}### Lock-Free SPSC Worker Pool (SharedArrayBuffer & Atomics)${c.reset}`,
    `To eliminate mutex contention, leverage ${c.cyan}SharedArrayBuffer${c.reset} with hardware CAS (${c.cyan}Atomics${c.reset}):`,
    ``,
    `${c.gray}\`\`\`typescript${c.reset}`,
    `${c.magenta}import${c.reset} { Worker, parentPort } ${c.magenta}from${c.reset} ${c.green}'node:worker_threads'${c.reset};`,
    ``,
    `${c.gray}// 1. Shared atomic memory buffer across worker threads${c.reset}`,
    `${c.magenta}const${c.reset} sharedBuffer = ${c.magenta}new${c.reset} ${c.yellow}SharedArrayBuffer${c.reset}(${c.cyan}1024${c.reset});`,
    `${c.magenta}const${c.reset} state = ${c.magenta}new${c.reset} ${c.yellow}Int32Array${c.reset}(sharedBuffer);`,
    ``,
    `${c.gray}// 2. Lock-free Atomic Compare-And-Swap (CAS) task dispatch${c.reset}`,
    `${c.magenta}export function${c.reset} ${c.blue}dispatchTask${c.reset}(taskId: ${c.yellow}number${c.reset}): ${c.yellow}boolean${c.reset} {`,
    `  ${c.magenta}const${c.reset} prev = ${c.yellow}Atomics${c.reset}.${c.blue}compareExchange${c.reset}(state, ${c.cyan}0${c.reset}, ${c.cyan}0${c.reset}, taskId);`,
    `  ${c.yellow}Atomics${c.reset}.${c.blue}notify${c.reset}(state, ${c.cyan}0${c.reset}, ${c.cyan}1${c.reset}); ${c.gray}// Wake sleeper worker thread${c.reset}`,
    `  ${c.magenta}return${c.reset} prev === ${c.cyan}0${c.reset};`,
    `}`,
    `${c.gray}\`\`\`${c.reset}`,
    ``,
    `${c.bold}Architecture Highlights:${c.reset}`,
    `• ${c.bold}Zero lock contention:${c.reset} O(1) single-cycle hardware CAS operation.`,
    `• ${c.bold}Verified reasoning:${c.reset} Generated via ChatGPT Web Pro (0 API tokens billed).`,
  ];

  for (const line of responseLines) {
    console.log(line);
    await sleep(45);
  }

  await sleep(300);
  console.log(`\n${c.green}${c.bold}✔ Antigravity session finished${c.reset} ${c.gray}• Roundtrip: 1.8s • API Cost: $0.00${c.reset}\n`);
  await sleep(2000);
}

main().catch(console.error);
