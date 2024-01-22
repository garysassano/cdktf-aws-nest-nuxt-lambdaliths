import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

// Mirrors the .dockerignore files in the function directories.
const IGNORED = new Set(["node_modules", "dist", "build", ".svelte-kit"]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (IGNORED.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/** Hashes every file Docker would receive as build context. */
export function hashBuildContext(dir: string): string {
  const hash = createHash("sha256");

  for (const file of walk(dir)) {
    hash.update(relative(dir, file).split(sep).join("/"));
    hash.update(readFileSync(file));
  }

  return hash.digest("hex");
}
