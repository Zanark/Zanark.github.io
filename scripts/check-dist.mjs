import { readdir, readFile, lstat } from "node:fs/promises";
import { resolve, relative, extname, join } from "node:path";
import assert from "node:assert/strict";

const root = resolve("dist");
const allowed = new Set([".html", ".css", ".js", ".svg", ".woff2", ".txt"]);
const deniedText = [
  /\.portfolio-input/i, /\.agent-context/i, /[A-Z]:\\(?:devdesk|Users|unprotectedDownloads)/i,
  /\b(?:CAREER|PROJECT|ENG)-\d{3}\b/, /\b(?:SRC-P|ES-)\d{3}\b/,
  /portal\.microsofticm\.com/i, /msazure\.visualstudio\.com/i,
  /Engineering-Career-Dossier/i, /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
];
const files = [];

async function walk(directory) {
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);
    const info = await lstat(path);
    assert.ok(!info.isSymbolicLink(), `Symlink in preview output: ${path}`);
    assert.ok(!entry.startsWith("."), `Hidden preview entry: ${path}`);
    if (info.isDirectory()) await walk(path);
    else {
      assert.ok(info.isFile() && info.nlink === 1, `Linked or special output: ${path}`);
      assert.ok(allowed.has(extname(path)), `Unexpected file type: ${path}`);
      files.push(path);
    }
  }
}

await walk(root);
const names = new Set(files.map((file) => relative(root, file).replaceAll("\\", "/")));
for (const required of ["index.html", "profile/index.html", "colophon/index.html", "404.html"]) {
  assert.ok(names.has(required), `Required page missing: ${required}`);
}
let bytes = 0;
for (const file of files) {
  const data = await readFile(file);
  bytes += data.length;
  assert.ok(data.length > 0, `Empty output: ${file}`);
  if (file.endsWith(".woff2")) {
    assert.equal(data.subarray(0, 4).toString(), "wOF2", `Invalid font: ${file}`);
    continue;
  }
  const text = data.toString("utf8");
  if (file.endsWith(".js") && text.includes("gsapVersions")) {
    assert.match(text, /Copyright \(c\) 2008-2026, GreenSock/);
    assert.ok(names.has("licenses/gsap.txt"), "Animation-library notice is missing");
  }
  for (const denied of deniedText) assert.ok(!denied.test(text), `Private-source marker in ${file}: ${denied}`);
  if (file.endsWith(".html")) {
    assert.match(text, /name="robots" content="noindex, nofollow"/, `Local-review marker missing: ${file}`);
    for (const match of text.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const url = new URL(match[1], "http://preview.local");
      const path = decodeURIComponent(url.pathname).slice(1);
      const candidate = !path || path.endsWith("/") ? `${path}index.html` : path;
      assert.ok(names.has(candidate), `Broken internal asset/link in ${relative(root, file)}: ${match[1]}`);
    }
  }
}
console.log(`Local preview output: ${files.length} files, ${bytes.toLocaleString()} bytes. Private-source and internal-link gates passed. This is not publication approval.`);
