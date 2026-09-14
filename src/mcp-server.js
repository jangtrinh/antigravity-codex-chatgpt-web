#!/usr/bin/env node
/**
 * MCP Server for Antigravity - ChatGPT Web & Codex Bridge
 * Provides JSON-RPC 2.0 stdio interface compatible with Antigravity and MCP clients.
 */

const { spawn } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + "\n");
}

function normalizeModel(model) {
  if (!model) return "chatgpt-web/medium";
  const m = model.toLowerCase().trim();
  switch (m) {
    case "pro":
      return "chatgpt-web/pro";
    case "xhigh":
    case "extra-high":
    case "extra_high":
      return "chatgpt-web/extra-high";
    case "high":
      return "chatgpt-web/high";
    case "medium":
      return "chatgpt-web/medium";
    case "light":
      return "chatgpt-web/light";
    case "astra":
    case "gpt-6-astra":
      return "gpt-6-astra";
    default:
      return model;
  }
}

function runCodex(prompt, rawModel = "chatgpt-web/medium", cwd = process.cwd()) {
  const model = normalizeModel(rawModel);

  return new Promise((resolve, reject) => {
    const args = [
      "exec",
      "--ephemeral",
      "--skip-git-repo-check",
      "-m",
      model,
      prompt,
    ];

    const child = spawn("codex", args, {
      cwd: cwd || process.cwd(),
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0 && !stdout.trim()) {
        return reject(
          new Error(`Codex process exited with code ${code}: ${stderr.trim() || "Unknown error"}`)
        );
      }

      // Filter out Codex header/footer markers if present
      let cleanOutput = stdout;
      const codexMarker = stdout.lastIndexOf("codex\n");
      if (codexMarker !== -1) {
        cleanOutput = stdout.slice(codexMarker + 6);
        const tokensMarker = cleanOutput.lastIndexOf("\ntokens used");
        if (tokensMarker !== -1) {
          cleanOutput = cleanOutput.slice(0, tokensMarker);
        }
      }

      // Clean trailing ANSI escapes and whitespaces
      cleanOutput = cleanOutput
        // eslint-disable-next-line no-control-regex
        .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "")
        .trim();

      resolve(cleanOutput || stdout.trim());
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to execute codex: ${err.message}`));
    });

    // Close stdin immediately so codex exec does not wait for user input
    child.stdin.end();
  });
}

const TOOLS = [
  {
    name: "ask_chatgpt_web",
    description:
      "Gửi prompt tới tài khoản ChatGPT Web thông qua bridge codex-chatgpt-web. Hỗ trợ các model: chatgpt-web/pro (suy luận sâu nhất), chatgpt-web/extra-high, chatgpt-web/high, chatgpt-web/medium (mặc định), chatgpt-web/light (nhanh nhất).",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "Câu hỏi hoặc tác vụ cần gửi tới ChatGPT Web.",
        },
        model: {
          type: "string",
          enum: [
            "chatgpt-web/pro",
            "chatgpt-web/extra-high",
            "chatgpt-web/high",
            "chatgpt-web/medium",
            "chatgpt-web/light",
            "pro",
            "xhigh",
            "high",
            "medium",
            "light",
          ],
          default: "chatgpt-web/medium",
          description: "Mô hình ChatGPT Web muốn sử dụng.",
        },
        cwd: {
          type: "string",
          description: "Thư mục ngữ cảnh làm việc (tùy chọn, mặc định là process.cwd()).",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "ask_codex_native",
    description:
      "Gửi prompt tới Codex với mô hình coding chuyên sâu gpt-6-astra thông qua codex-chatgpt-web bridge.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "Câu lệnh hoặc tác vụ lập trình chuyên sâu.",
        },
        model: {
          type: "string",
          default: "gpt-6-astra",
          description: "Mô hình Codex native (mặc định gpt-6-astra).",
        },
        cwd: {
          type: "string",
          description: "Thư mục ngữ cảnh làm việc.",
        },
      },
      required: ["prompt"],
    },
  },
];

rl.on("line", async (line) => {
  if (!line.trim()) return;

  let message;
  try {
    message = JSON.parse(line);
  } catch (err) {
    sendResponse({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" },
    });
    return;
  }

  const { id, method, params } = message;

  try {
    switch (method) {
      case "initialize":
        sendResponse({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: "antigravity-codex-chatgpt-web",
              version: "1.0.0",
            },
          },
        });
        break;

      case "notifications/initialized":
        // Notification - no reply required
        break;

      case "ping":
        sendResponse({
          jsonrpc: "2.0",
          id,
          result: {},
        });
        break;

      case "tools/list":
        sendResponse({
          jsonrpc: "2.0",
          id,
          result: {
            tools: TOOLS,
          },
        });
        break;

      case "tools/call": {
        const { name, arguments: args } = params || {};
        if (name === "ask_chatgpt_web") {
          const prompt = args?.prompt;
          const model = args?.model || "chatgpt-web/medium";
          const cwd = args?.cwd || process.cwd();

          if (!prompt) {
            sendResponse({
              jsonrpc: "2.0",
              id,
              error: {
                code: -32602,
                message: "Missing required argument 'prompt'",
              },
            });
            return;
          }

          const result = await runCodex(prompt, model, cwd);
          sendResponse({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: result,
                },
              ],
            },
          });
        } else if (name === "ask_codex_native") {
          const prompt = args?.prompt;
          const model = args?.model || "gpt-6-astra";
          const cwd = args?.cwd || process.cwd();

          if (!prompt) {
            sendResponse({
              jsonrpc: "2.0",
              id,
              error: {
                code: -32602,
                message: "Missing required argument 'prompt'",
              },
            });
            return;
          }

          const result = await runCodex(prompt, model, cwd);
          sendResponse({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: result,
                },
              ],
            },
          });
        } else {
          sendResponse({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Tool not found: ${name}`,
            },
          });
        }
        break;
      }

      default:
        if (id !== undefined) {
          sendResponse({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          });
        }
        break;
    }
  } catch (err) {
    if (id !== undefined) {
      sendResponse({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: err.message || "Internal error",
        },
      });
    }
  }
});
