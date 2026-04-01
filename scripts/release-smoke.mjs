import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = "/app";
const mode = process.argv.includes("--build") ? "build" : process.argv.includes("--test") ? "test" : "package";
const packageName = process.argv.includes("--package")
  ? process.argv[process.argv.indexOf("--package") + 1]
  : null;

const checks = [
  "README.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "CHANGELOG.md",
  "packages/caption-player/src/CaptionPlayer.tsx",
  "packages/deaf-ui/src/index.ts",
  "packages/isl-tools/src/index.ts",
  "docs/getting-started.md",
];

const packageChecks = {
  "caption-player": ["packages/caption-player/package.json", "packages/caption-player/src/index.ts"],
  "deaf-ui": ["packages/deaf-ui/package.json", "packages/deaf-ui/src/index.ts"],
  "isl-tools": ["packages/isl-tools/package.json", "packages/isl-tools/src/index.ts"],
};

const pathsToCheck = packageName ? packageChecks[packageName] ?? [] : checks;

for (const relativePath of pathsToCheck) {
  const fullPath = resolve(root, relativePath);
  if (!existsSync(fullPath)) {
    console.error(`Missing required file: ${relativePath}`);
    process.exit(1);
  }
}

const captionPackage = JSON.parse(readFileSync(resolve(root, "packages/caption-player/package.json"), "utf8"));
if (captionPackage.name !== "@upliftiq/caption-player") {
  console.error("caption-player package name is incorrect.");
  process.exit(1);
}

if (mode === "test") {
  const readme = readFileSync(resolve(root, "README.md"), "utf8");
  if (!readme.includes("Accessibility Mode") || !readme.includes("English") || !readme.includes("Hindi")) {
    console.error("README is missing release-ready accessibility or language details.");
    process.exit(1);
  }
}

console.log(`Release smoke check passed for ${mode}${packageName ? ` (${packageName})` : ""}.`);
