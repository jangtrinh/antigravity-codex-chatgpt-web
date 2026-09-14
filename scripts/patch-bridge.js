#!/usr/bin/env node
/**
 * scripts/patch-bridge.js
 * Automatically patches codex-chatgpt-web to support:
 * 1. Native ChatGPT image generation without attachment errors.
 * 2. Instant completion detection for generated images (fixes 60s timeout).
 * 3. Automatic extraction and formatting of image URLs in markdown (![Generated Image](src)).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOME = os.homedir();
const CODEX_DIR = path.join(HOME, '.codex-chatgpt-web');
const VERSIONS_DIR = path.join(CODEX_DIR, 'versions');

function log(msg) {
  console.log(`[patch-bridge] ${msg}`);
}

function findAppDirs() {
  if (!fs.existsSync(VERSIONS_DIR)) {
    return [];
  }
  const versions = fs.readdirSync(VERSIONS_DIR);
  const appDirs = [];
  for (const v of versions) {
    const appDir = path.join(VERSIONS_DIR, v, 'app');
    if (fs.existsSync(appDir) && fs.existsSync(path.join(appDir, 'cli.js'))) {
      appDirs.push(appDir);
    }
  }
  return appDirs;
}

function patchFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    log(`File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Create backup if not exists
  const bakPath = filePath + '.bak';
  if (!fs.existsSync(bakPath)) {
    fs.copyFileSync(filePath, bakPath);
    log(`Created backup at ${bakPath}`);
  }

  for (const { name, target, replacement, isRegex } of replacements) {
    if (isRegex) {
      if (target.test(content)) {
        content = content.replace(target, replacement);
        log(`Applied regex patch [${name}] to ${path.basename(filePath)}`);
        changed = true;
      } else {
        log(`Pattern for [${name}] already patched or not found in ${path.basename(filePath)}`);
      }
    } else {
      if (content.includes(target)) {
        content = content.replace(target, replacement);
        log(`Applied string patch [${name}] to ${path.basename(filePath)}`);
        changed = true;
      } else {
        log(`Target for [${name}] already patched or not found in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    log(`Saved patched file: ${filePath}`);
  } else {
    log(`No modifications needed for ${path.basename(filePath)}`);
  }

  return changed;
}

function runPatch() {
  const appDirs = findAppDirs();
  if (appDirs.length === 0) {
    log(`No codex-chatgpt-web app directories found in ${VERSIONS_DIR}`);
    return;
  }

  let anyModified = false;

  for (const appDir of appDirs) {
    log(`Found target app dir: ${appDir}`);
    const cliPath = path.join(appDir, 'cli.js');
    const bhPath = path.join(appDir, 'browser-helper.cjs');

    // 1. Patch cli.js
    const cliReplacements = [
      {
        name: 'prompt-image-generation',
        target: `o?"Each image_attachment in the context refers, in order, to an image the user manually attached to this ChatGPT message. If its corresponding image is absent, say that it was not provided instead of guessing.":c?"Each image_attachment in the staged context refers to the correspondingly named image attached to this commit message; inspect it directly.":"Each image_attachment in the context refers to the correspondingly named image attached to this ChatGPT message; inspect it directly."`,
        replacement: `"When the user asks to generate, create, or draw an image, invoke the native ChatGPT image generation tool directly to produce a brand-new image without requiring any input image or attachment."`
      },
      {
        name: 'completion-action-image-cli',
        target: `completionActionVisible:B!==void 0`,
        replacement: `completionActionVisible:(B!==void 0||[...a.querySelectorAll("img")].some(x=>x.src&&!x.src.startsWith("data:image/svg")))`
      },
      {
        name: 'visible-text-image-urls-cli',
        target: `visibleText:w.map((_)=>_.innerText.trim()).filter(Boolean).join(\`\n\n\`),fullHtml:`,
        replacement: `visibleText:w.map((_)=>_.innerText.trim()).filter(Boolean).join(\`\n\n\`)+([...a.querySelectorAll("img")].map(x=>x.src).filter(x=>x&&!x.startsWith("data:image/svg")).map(u=>\`\n\n![Generated Image](\${u})\n\n\`).join("")),fullHtml:`
      }
    ];

    if (patchFile(cliPath, cliReplacements)) anyModified = true;

    // 2. Patch browser-helper.cjs
    const bhReplacements = [
      {
        name: 'completion-action-image-bh',
        target: `completionActionVisible:se!==void 0`,
        replacement: `completionActionVisible:(se!==void 0||[...a.querySelectorAll("img")].some(x=>x.src&&!x.src.startsWith("data:image/svg")))`
      },
      {
        name: 'visible-text-image-urls-bh',
        target: `visibleText:T.map((p)=>p.innerText.trim()).filter(Boolean).join(\`\n\n\`),fullHtml:`,
        replacement: `visibleText:T.map((p)=>p.innerText.trim()).filter(Boolean).join(\`\n\n\`)+([...a.querySelectorAll("img")].map(x=>x.src).filter(x=>x&&!x.startsWith("data:image/svg")).map(u=>\`\n\n![Generated Image](\${u})\n\n\`).join("")),fullHtml:`
      }
    ];

    if (patchFile(bhPath, bhReplacements)) anyModified = true;
  }

  if (anyModified) {
    log('Restarting bridge background service to apply changes...');
    try {
      execSync('pkill -f "cli.js serve" || true', { stdio: 'ignore' });
      execSync('pkill -f "browser-helper.cjs" || true', { stdio: 'ignore' });
      log('Bridge daemon gracefully signaled. It will restart on next request.');
    } catch (e) {
      log('Notice: Could not restart daemon automatically: ' + e.message);
    }
  }

  log('Bridge patch check & apply complete!');
}

function restoreBackup() {
  const appDirs = findAppDirs();
  for (const appDir of appDirs) {
    for (const f of ['cli.js', 'browser-helper.cjs']) {
      const p = path.join(appDir, f);
      const bak = p + '.bak';
      if (fs.existsSync(bak)) {
        fs.copyFileSync(bak, p);
        log(`Restored original file from ${bak}`);
      }
    }
  }
  log('Restore complete. Restarting bridge daemon...');
  try {
    execSync('pkill -f "cli.js serve" || true', { stdio: 'ignore' });
    execSync('pkill -f "browser-helper.cjs" || true', { stdio: 'ignore' });
  } catch (e) {}
}

if (process.argv.includes('--restore')) {
  restoreBackup();
} else {
  runPatch();
}
