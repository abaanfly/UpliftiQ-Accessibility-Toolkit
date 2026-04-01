import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const packageName = process.argv[2];
if (!packageName) {
  console.error("Expected a package directory name.");
  process.exit(1);
}

const root = "/app";
const packageRoot = resolve(root, "packages", packageName);
const sourceDir = join(packageRoot, "src");
const outputDir = join(packageRoot, "dist");

mkdirSync(outputDir, { recursive: true });

for (const file of readdirSync(sourceDir)) {
  if (file.endsWith(".css")) {
    cpSync(join(sourceDir, file), join(outputDir, file));
  }
}

if (!existsSync(outputDir)) {
  console.error(`Failed to prepare dist for ${packageName}.`);
  process.exit(1);
}

console.log(`Copied package assets for ${packageName}.`);
