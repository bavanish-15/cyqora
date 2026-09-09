import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.tsx$/.test(e.name)) files.push(p);
  }
  return files;
}

const pairs = [
  ['shadow-2xl', 'shadow-sm'],
  ['font-serif ', ''],
  ['text-[#F7F6F2]', 'text-white'],
  ['divide-[rgba(255,255,255,0.04)]', 'divide-[#DCDAD4]'],
  ['border-[rgba(255,255,255,0.04)]', 'border-[#DCDAD4]'],
  ['prose-invert', ''],
  ['tracking-widest', 'tracking-wide'],
  ['font-extrabold', 'font-semibold'],
  ['bg-black/80', 'bg-[rgba(41,41,39,0.35)]'],
  ['bg-black/70', 'bg-[rgba(41,41,39,0.35)]'],
  ['#3266D0', '#71859A'],
  ['#334155', '#DCDAD4'],
  ['#64748B', '#71859A'],
  // Soften card shells consistently
  ['rounded-xl bg-[#FFFFFF] border border-[#DCDAD4]', 'rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm'],
];

// Avoid double-adding shadow-sm
function apply(content) {
  let c = content;
  for (const [from, to] of pairs) {
    if (from.includes('shadow-sm') && to.includes('shadow-sm')) continue;
    c = c.split(from).join(to);
  }
  // Deduplicate accidental double shadow-sm
  c = c.split('shadow-sm shadow-sm').join('shadow-sm');
  return c;
}

let n = 0;
for (const f of walk('src')) {
  const o = fs.readFileSync(f, 'utf8');
  const c = apply(o);
  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
    console.log('patched', f);
  }
}
console.log('done', n);
