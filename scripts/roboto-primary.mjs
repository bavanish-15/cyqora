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

/**
 * Roboto should dominate. Keep monospace only where it marks numeric/technical values.
 * Strip font-mono from label/eyebrow/button class clusters; retain on value displays.
 */
let n = 0;
for (const f of walk('src')) {
  let c = fs.readFileSync(f, 'utf8');
  const o = c;

  // Labels / eyebrows / table headers that used mono + uppercase
  c = c.replace(/font-mono font-medium uppercase/g, 'font-medium');
  c = c.replace(/font-mono uppercase tracking-wider/g, 'font-medium tracking-wide');
  c = c.replace(/uppercase font-mono tracking-wider/g, 'font-medium tracking-wide');
  c = c.replace(/uppercase tracking-wider font-mono/g, 'font-medium tracking-wide');
  c = c.replace(/text-xs font-mono font-medium/g, 'text-xs font-medium');
  c = c.replace(/text-\[11px\] font-mono font-medium/g, 'text-[11px] font-medium');
  c = c.replace(/text-\[10px\] font-mono font-medium/g, 'text-[10px] font-medium');
  c = c.replace(/text-\[10px\] font-mono uppercase/g, 'text-[10px] font-medium');
  c = c.replace(/text-xs font-mono font-semibold/g, 'text-xs font-medium');
  c = c.replace(/font-mono font-semibold/g, 'font-semibold');
  c = c.replace(/font-mono font-bold tracking-wider/g, 'font-semibold tracking-wide');
  c = c.replace(/font-bold tracking-wider text-\[#292927\] uppercase font-mono/g, 'font-semibold tracking-wide text-[#292927]');
  c = c.replace(/font-bold text-\[#292927\] tracking-wide uppercase font-mono/g, 'font-semibold text-[#292927] tracking-wide');

  // Button mono
  c = c.replace(/text-xs font-mono font-medium transition-colors/g, 'text-xs font-medium transition-colors');

  // Keep font-mono on large metric displays (font-mono text- / font-bold font-mono) — leave those

  if (c !== o) {
    fs.writeFileSync(f, c);
    n++;
    console.log('typo', f);
  }
}
console.log('done', n);
