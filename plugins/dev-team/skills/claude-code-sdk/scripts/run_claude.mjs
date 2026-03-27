#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const globalRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
const sdkPath = join(globalRoot, "@anthropic-ai/claude-agent-sdk", "sdk.mjs");
if (!existsSync(sdkPath)) {
  console.error(
    "Claude Code execution failed: global @anthropic-ai/claude-agent-sdk not found at " +
      sdkPath +
      ". Install with: npm install -g @anthropic-ai/claude-agent-sdk",
  );
  process.exit(1);
}
const { query } = await import(pathToFileURL(sdkPath).href);

/** @param {object} msg */
async function getContentFromMessage(msg) {
  const content = msg.message?.content;
  if (!Array.isArray(content)) return;
  let result = "";
  const stamp = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `[${h}:${m}:${s}] `;
  };
  for (const block of content) {
    if (block && typeof block === "object" && "type" in block && block.type === "text" && "text" in block && typeof block.text === "string") {
      result += stamp() + block.text + "\n";
    }
    else if (block && typeof block === "object" && "type" in block && block.type === "tool_use" && "name" in block) {
      result += stamp() + "Calling Tool: " + block.name + "\n";
    }
    else {
      console.log("unknown block type: " + JSON.stringify(block) + "\n");
    }
  }
  return result;
}

async function main() {
  let values;
  try {
    ({ values } = parseArgs({
      args: process.argv.slice(2),
      options: {
        query: { type: "string" },
        cwd: { type: "string" },
        resume: { type: "string" },
        "log-file": { type: "string" },
        "append-system-prompt": { type: "string" },
      },
      allowPositionals: false,
      strict: true,
    }));
  } catch {
    console.error(
      "Usage: run_claude --query QUERY --cwd CWD [--log-file PATH] [--resume RESUME] [--append-system-prompt TEXT]",
    );
    process.exit(2);
  }

  const cwd = values.cwd;
  if (!cwd) {
    console.error("error: the following arguments are required: --cwd");
    process.exit(2);
  }
  if (!isAbsolute(cwd)) {
    console.error("error: --cwd must be an absolute path");
    process.exit(2);
  }

  const prompt = values.query + "\nMake sure to work in directory: " + cwd;
  if (!prompt) {
    console.error("error: the following arguments are required: --query");
    process.exit(2);
  }


  const logFile = values["log-file"];
  const resume = values.resume;
  const appendSystemPrompt = values["append-system-prompt"];

  /** @type {string | undefined} */
  let res;

  /** @type {string | null} */
  let sessionDebugFile = null;

  try {
    const options = {
      // cwd,
      ...(appendSystemPrompt !== undefined
        ? { systemPrompt: appendSystemPrompt }
        : {}),
      settingSources: /** @type {const} */ (["user", "project"]),
      ...(resume !== undefined ? { resume } : {}),
      allowedTools: [
        "Read",
        "Edit",
        "Bash",
        "Write",
        "Glob",
        "Grep",
        "Skill",
      ],
    };

    for await (const message of query({ prompt, options })) {
      // console.log(message);
      if (message.type === "system") {
        if (message.subtype === "init") {
          const sessionId = message.session_id;
          if (sessionId) {
            const dir = join("/tmp", ".claude");
            await mkdir(dir, { recursive: true });
            sessionDebugFile = join(dir, sessionId);
            if (logFile) {
              console.log("Start Session with ID: " + sessionId);
              await writeFile(
                logFile,
                `Start Session with ID: ${sessionId}\n\n`,
              );
            }
          }
        }
        else if (message.subtype === "api_retry") {
          console.log("Retry connecting to Claude API... " + message.attempt + "/" + message.max_retries);
        }
      }
      if (sessionDebugFile) {
        await appendFile(
          sessionDebugFile,
          JSON.stringify(message) + "\n",
        );
      }
      if (message.type === "system" && message.subtype === "init") {
        
      } else if (message.type === "result") {
        if (message.subtype === "success") {
          res =
            message.result +
            "\nResume this session with id: " +
            message.session_id;
        } else {
          res =
            message.errors.join("\n") +
            "\nResume this session with id: " +
            message.session_id;
        }
      } else if (message.type === "assistant") {
        const content = await getContentFromMessage(message);
        if (!content) continue;
        console.log(content + "\n");
        if (!logFile) continue;
        await appendFile(logFile, content + "\n\n");
      }
    }
    console.log(res === undefined ? "None" : res);
  } catch (e) {
    console.log("Claude Code execution failed: " + String(e));
  }
}

await main();
