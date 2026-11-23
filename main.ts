// bring-the-humans-03 entry: the entry is the TikTok ad itself. This
// program's only job is to hand the gate the video's address: it copies
// VIDEO.json from the repository root (the bot dir) into the output dir,
// where the house reads it, fetches the video from TikTok, and ranks it by
// the views it reads there.
//
// Local stand-ins outside the grader's container:
//   MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

// Validate before copying: VIDEO.json must parse and carry a full TikTok
// video URL (short links are rejected by the gate), so fail loudly here
// instead of handing the house an address it cannot use.
const source = join(botDir, 'VIDEO.json');
let parsed: { url?: unknown };
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof parsed.url !== 'string' || !/^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/.test(parsed.url)) {
  console.error('VIDEO.json must hold {"url": "https://www.tiktok.com/@<handle>/video/<id>"}');
  process.exit(1);
}

const target = join(outputDir, 'VIDEO.json');
try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`could not copy ${source} to ${target}: ${(err as Error).message}`);
  process.exit(1);
}
