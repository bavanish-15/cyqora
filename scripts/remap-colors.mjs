/**
 * One-shot visual remapper: replace legacy neon/cyber hex tokens
 * with the muted light-first palette. Does not change structure.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src');

const SKIP = new Set([
  path.resolve('src/index.css'),
  path.resolve('src/utils/themeColors.ts'),
]);

const REPLACEMENTS = [
  ['#0B0F14', '#F7F6F2'],
  ['#0D131B', '#F1F0EC'],
  ['#10151C', '#F7F6F2'],
  ['#111720', '#FFFFFF'],
  ['#151B23', '#F1F0EC'],
  ['#151C25', '#F1F0EC'],
  ['#161D27', '#F1F0EC'],
  ['#171E28', '#FFFFFF'],
  ['#18212C', '#E9E7E1'],
  ['#1C2430', '#DCDAD4'],
  ['#2D394A', '#D0CEC6'],
  ['#F7F4EF', '#F7F6F2'],
  ['#FFFEFB', '#FFFFFF'],
  ['#F0EBE3', '#F1F0EC'],
  ['#E8E2D8', '#E9E7E1'],
  ['#D9D2C8', '#DCDAD4'],
  ['#C4BBB0', '#D0CEC6'],
  ['#F3F4F6', '#292927'],
  ['#2C2A28', '#292927'],
  ['#A7B0BD', '#6F6D68'],
  ['#6B6560', '#6F6D68'],
  ['#8A847C', '#6F6D68'],
  ['#6F7A88', '#6F6D68'],
  ['#4B5563', '#A8A69F'],
  ['#B5AFA8', '#A8A69F'],
  ['#4F8CFF', '#6F6275'],
  ['#7AA7FF', '#71859A'],
  ['#6A9DFF', '#5A5160'],
  ['#3D7BE6', '#5A5160'],
  ['#2563EB', '#6F6275'],
  ['#7A4A5C', '#6F6275'],
  ['#5C3A46', '#5A5160'],
  ['#9A6A7A', '#71859A'],
  ['#22C55E', '#718C78'],
  ['#16A34A', '#718C78'],
  ['#EF4444', '#A87570'],
  ['#DC2626', '#A87570'],
  ['#F59E0B', '#B49562'],
  ['#EAB308', '#B49562'],
  ['#A85A52', '#A87570'],
  ['#B8860B', '#B49562'],
  ['#5F7A66', '#718C78'],
  ['rgba(255,255,255,0.08)', '#DCDAD4'],
  ['rgba(255, 255, 255, 0.08)', '#DCDAD4'],
  ['rgba(255,255,255,0.06)', '#DCDAD4'],
  ['rgba(255, 255, 255, 0.06)', '#DCDAD4'],
  ['rgba(255,255,255,0.10)', '#DCDAD4'],
  ['rgba(255, 255, 255, 0.10)', '#DCDAD4'],
  ['rgba(255,255,255,0.12)', '#D0CEC6'],
  ['rgba(255, 255, 255, 0.12)', '#D0CEC6'],
  ['rgba(255,255,255,0.15)', '#D0CEC6'],
  ['rgba(255, 255, 255, 0.15)', '#D0CEC6'],
  ['rgba(255,255,255,0.16)', '#D0CEC6'],
  ['rgba(255, 255, 255, 0.16)', '#D0CEC6'],
  ['rgba(122,74,92,', 'rgba(111,98,117,'],
  ['rgba(122, 74, 92,', 'rgba(111, 98, 117,'],
  ['rgba(44,42,40,', 'rgba(41,41,39,'],
  ['rgba(44, 42, 40,', 'rgba(41, 41, 39,'],
  ['rgba(79,140,255,', 'rgba(111,98,117,'],
  ['rgba(79, 140, 255,', 'rgba(111, 98, 117,'],
  ['rgba(168,90,82,', 'rgba(168,117,112,'],
  ['rgba(168, 90, 82,', 'rgba(168, 117, 112,'],
  ['rgba(184,134,11,', 'rgba(180,149,98,'],
  ['rgba(184, 134, 11,', 'rgba(180, 149, 98,'],
  ['rgba(95,122,102,', 'rgba(113,140,120,'],
  ['rgba(95, 122, 102,', 'rgba(113, 140, 120,'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(p);
  }
  return files;
}

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  if (SKIP.has(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed++;
    console.log('updated', path.relative(process.cwd(), file));
  }
}
console.log(`Done. ${changed} files updated.`);
