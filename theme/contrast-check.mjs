// WCAG 2.2 Relative Luminance and Contrast Ratio Calculator
// Formula: https://www.w3.org/WAI/GL/wiki/Relative_luminance

function getLuminance(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const rgb = clean.match(/.{2}/g).map(x => parseInt(x, 16) / 255);
  const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrast(fg, bg) {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const moonlitGold = {
  name: 'Moonlit Gold (Default)',
  bg: '#07080B',
  bgElevated: '#0D0E12',
  surface: '#13141A',
  surface2: '#1A1C23',
  border: '#25262E',
  borderStrong: '#5E6174', // minimally adjusted from #363945 to satisfy WCAG 2.2 1.4.11 UI non-text contrast >= 3.0:1
  text: '#F2EEE6',
  textMuted: '#ABA9A6',
  textFaint: '#8B8D95',
  accent: '#F2B864',
  accentStrong: '#FFCB7E',
  accentInk: '#231600',
  accent2: '#9DB4D6',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171'
};

const obsidianMint = {
  name: 'Obsidian Mint',
  bg: '#07090D',
  bgElevated: '#0D1017',
  surface: '#121720',
  surface2: '#18202C',
  border: '#232E3E',
  borderStrong: '#4D617F',
  text: '#EDF2F7',
  textMuted: '#A0AEC0',
  textFaint: '#78889E', // adjusted from #718096 to satisfy >= 4.5:1 on surface
  accent: '#5EEAD4',
  accentStrong: '#2DD4BF',
  accentInk: '#042F2E',
  accent2: '#8B7CFF',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171'
};

const graphiteAmber = {
  name: 'Graphite & Amber',
  bg: '#0A0A0B',
  bgElevated: '#111113',
  surface: '#18181B',
  surface2: '#222226',
  border: '#2E2E33',
  borderStrong: '#5E5E69',
  text: '#F4F4F5',
  textMuted: '#A1A1AA',
  textFaint: '#82828C', // adjusted to satisfy >= 4.5:1 on bg/surface
  accent: '#F5B84B',
  accentStrong: '#FBBF24',
  accentInk: '#241400',
  accent2: '#FF7A59',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171'
};

const inkViolet = {
  name: 'Ink & Violet',
  bg: '#0A0B14',
  bgElevated: '#111220',
  surface: '#17192C',
  surface2: '#20223A',
  border: '#2C2E4E',
  borderStrong: '#595D94',
  text: '#F1F1F8',
  textMuted: '#A5A6C4',
  textFaint: '#8082A8', // adjusted from #77799E to satisfy >= 4.5:1 on surface
  accent: '#A78BFA',
  accentStrong: '#C4B5FD',
  accentInk: '#1E1238',
  accent2: '#38BDF8',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171'
};

function runChecks(theme) {
  console.log(`\n========================================`);
  console.log(`Theme: ${theme.name}`);
  console.log(`========================================`);

  const pairs = [
    { fg: theme.text, bg: theme.bg, label: 'Primary Text on Page BG', min: 4.5, pref: 7.0 },
    { fg: theme.text, bg: theme.bgElevated, label: 'Primary Text on Elevated BG', min: 4.5, pref: 7.0 },
    { fg: theme.text, bg: theme.surface, label: 'Primary Text on Surface', min: 4.5, pref: 7.0 },
    { fg: theme.text, bg: theme.surface2, label: 'Primary Text on Surface-2', min: 4.5, pref: 7.0 },
    { fg: theme.textMuted, bg: theme.bg, label: 'Muted Text on Page BG', min: 4.5 },
    { fg: theme.textMuted, bg: theme.surface, label: 'Muted Text on Surface', min: 4.5 },
    { fg: theme.textMuted, bg: theme.surface2, label: 'Muted Text on Surface-2', min: 4.5 },
    { fg: theme.textFaint, bg: theme.bg, label: 'Faint Text on Page BG', min: 4.5 },
    { fg: theme.textFaint, bg: theme.surface, label: 'Faint Text on Surface', min: 4.5 },
    { fg: theme.accent, bg: theme.bg, label: 'Accent on Page BG (Large/Heading)', min: 3.0 },
    { fg: theme.accent, bg: theme.surface, label: 'Accent on Surface (Large/UI)', min: 3.0 },
    { fg: theme.accentInk, bg: theme.accent, label: 'Accent-Ink on Accent Button', min: 4.5, pref: 7.0 },
    { fg: theme.borderStrong, bg: theme.bg, label: 'Border-Strong on Page BG (UI)', min: 3.0 },
    { fg: theme.border, bg: theme.bg, label: 'Hairline Border on Page BG', min: 1.5 }
  ];

  let allPassed = true;
  for (const p of pairs) {
    const ratio = getContrast(p.fg, p.bg);
    const passed = ratio >= p.min;
    if (!passed) allPassed = false;
    const status = passed ? 'PASS' : 'FAIL';
    const tag = p.pref && ratio >= p.pref ? '(AAA >= 7:1)' : `(AA >= ${p.min}:1)`;
    console.log(
      `${status.padEnd(5)} | ${ratio.toFixed(2)}:1 | ${p.label.padEnd(36)} | ${p.fg} on ${p.bg} ${tag}`
    );
  }
  return allPassed;
}

const p1 = runChecks(moonlitGold);
const p2 = runChecks(obsidianMint);
const p3 = runChecks(graphiteAmber);
const p4 = runChecks(inkViolet);

if (!p1 || !p2 || !p3 || !p4) {
  console.log('\n[WARNING] One or more contrast checks failed threshold.');
} else {
  console.log('\n[SUCCESS] All critical contrast checks PASSED WCAG 2.2 AA requirements.');
}
