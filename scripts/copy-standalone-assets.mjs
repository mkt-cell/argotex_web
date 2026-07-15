// `output: "standalone"` traces only the JS server + required node_modules into
// .next/standalone. It intentionally skips public/ and .next/static, so cPanel
// (or any host running .next/standalone/server.js) needs them copied in manually.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");

if (!existsSync(standaloneDir)) {
  console.error('.next/standalone not found — did the build run with output: "standalone"?');
  process.exit(1);
}

cpSync(join(root, "public"), join(standaloneDir, "public"), { recursive: true });

mkdirSync(join(standaloneDir, ".next"), { recursive: true });
cpSync(join(root, ".next", "static"), join(standaloneDir, ".next", "static"), { recursive: true });

console.log("Copied public/ and .next/static into .next/standalone/");
