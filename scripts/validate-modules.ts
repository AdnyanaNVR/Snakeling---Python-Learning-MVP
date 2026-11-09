import fs from 'fs';
import path from 'path';

interface ExpectedComposition {
  total: number;
  mc: number;
  fb: number;
  ro: number;
  sb: number;
}

const EXPECTED_SPECS: Record<number, ExpectedComposition> = {
  1: { total: 8, mc: 3, fb: 3, ro: 2, sb: 0 },
  2: { total: 8, mc: 3, fb: 3, ro: 2, sb: 0 },
  3: { total: 8, mc: 3, fb: 2, ro: 2, sb: 1 },
  4: { total: 10, mc: 4, fb: 3, ro: 1, sb: 2 },
  5: { total: 10, mc: 3, fb: 3, ro: 2, sb: 2 },
  6: { total: 10, mc: 4, fb: 3, ro: 1, sb: 2 },
  7: { total: 10, mc: 4, fb: 3, ro: 1, sb: 2 },
  8: { total: 10, mc: 4, fb: 3, ro: 1, sb: 2 },
  9: { total: 10, mc: 4, fb: 3, ro: 1, sb: 2 },
  10: { total: 10, mc: 3, fb: 4, ro: 1, sb: 2 },
  11: { total: 10, mc: 3, fb: 3, ro: 2, sb: 2 },
  12: { total: 10, mc: 3, fb: 3, ro: 2, sb: 2 },
  13: { total: 10, mc: 3, fb: 3, ro: 2, sb: 2 },
  14: { total: 10, mc: 3, fb: 2, ro: 3, sb: 2 },
  15: { total: 10, mc: 3, fb: 2, ro: 3, sb: 2 },
  16: { total: 10, mc: 3, fb: 3, ro: 2, sb: 2 },
  17: { total: 10, mc: 3, fb: 4, ro: 1, sb: 2 },
  18: { total: 10, mc: 4, fb: 3, ro: 1, sb: 2 },
  19: { total: 10, mc: 3, fb: 3, ro: 2, sb: 2 },
  20: { total: 10, mc: 3, fb: 3, ro: 3, sb: 1 },
  21: { total: 10, mc: 3, fb: 2, ro: 3, sb: 2 },
  22: { total: 10, mc: 3, fb: 3, ro: 2, sb: 2 },
  23: { total: 10, mc: 4, fb: 3, ro: 1, sb: 2 },
  24: { total: 10, mc: 3, fb: 2, ro: 2, sb: 3 },
  25: { total: 15, mc: 4, fb: 4, ro: 3, sb: 4 },
};

export function validateModuleFile(filePath: string, moduleNum: number): { valid: boolean; errors: string[]; stats: any } {
  const errors: string[] = [];
  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`File not found: ${filePath}`], stats: null };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (e: any) {
    return { valid: false, errors: [`JSON parse error in ${filePath}: ${e.message}`], stats: null };
  }

  // Check required module properties
  if (!data.id) errors.push(`Missing module id in ${filePath}`);
  if (!data.title) errors.push(`Missing module title in ${filePath}`);
  if (!data.tip || !data.tip.title || !data.tip.body) {
    errors.push(`Missing valid tip card (title/body) in ${filePath}`);
  }

  const quizzes = data.quizzes || [];
  const spec = EXPECTED_SPECS[moduleNum];
  if (!spec) {
    errors.push(`Unknown module number ${moduleNum}`);
    return { valid: false, errors, stats: null };
  }

  const counts = { mc: 0, fb: 0, ro: 0, sb: 0 };
  let consecutiveType = '';
  let consecutiveCount = 0;

  quizzes.forEach((q: any, idx: number) => {
    const qLabel = `Q${idx + 1} (${q.id || 'no-id'})`;
    if (!q.id) errors.push(`${qLabel}: missing id`);
    if (!q.type || !['mc', 'fb', 'ro', 'sb'].includes(q.type)) {
      errors.push(`${qLabel}: invalid or missing type "${q.type}"`);
    } else {
      counts[q.type as keyof typeof counts] = (counts[q.type as keyof typeof counts] || 0) + 1;
    }

    if (!q.prompt) errors.push(`${qLabel}: missing prompt`);
    if (!q.explanation) errors.push(`${qLabel}: missing explanation`);

    // Type-specific validation
    if (q.type === 'mc') {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`${qLabel}: mc must have options array with >= 2 items`);
      }
      if (typeof q.answerIndex !== 'number' || q.answerIndex < 0 || (q.options && q.answerIndex >= q.options.length)) {
        errors.push(`${qLabel}: mc answerIndex (${q.answerIndex}) out of bounds`);
      }
    } else if (q.type === 'fb') {
      if (!q.codeWithBlank || !q.codeWithBlank.includes('___')) {
        errors.push(`${qLabel}: fb must have codeWithBlank containing '___'`);
      }
      const hasAccepted = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length > 0;
      const hasOptionsWithIdx = Array.isArray(q.options) && typeof q.answerIndex === 'number';
      if (!hasAccepted && !hasOptionsWithIdx) {
        errors.push(`${qLabel}: fb must have acceptedAnswers or options with answerIndex`);
      }
    } else if (q.type === 'ro') {
      if (!Array.isArray(q.lines) || q.lines.length < 2) {
        errors.push(`${qLabel}: ro must have lines array with >= 2 items`);
      }
    } else if (q.type === 'sb') {
      if (!Array.isArray(q.lines) || q.lines.length < 2) {
        errors.push(`${qLabel}: sb must have lines array with >= 2 items`);
      }
      if (typeof q.buggyLineIndex !== 'number' || q.buggyLineIndex < 0 || (q.lines && q.buggyLineIndex >= q.lines.length)) {
        errors.push(`${qLabel}: sb buggyLineIndex (${q.buggyLineIndex}) out of bounds`);
      }
      if (!q.fixedLine) {
        errors.push(`${qLabel}: sb missing fixedLine`);
      }
    }

    // Check no 3 identical types consecutively
    if (q.type === consecutiveType) {
      consecutiveCount++;
      if (consecutiveCount >= 3) {
        errors.push(`Module ${moduleNum}: 3 consecutive quizzes of type "${q.type}" at index ${idx}`);
      }
    } else {
      consecutiveType = q.type;
      consecutiveCount = 1;
    }
  });

  // Verify counts match spec
  if (quizzes.length !== spec.total) {
    errors.push(`Module ${moduleNum} total quizzes mismatch: expected ${spec.total}, found ${quizzes.length}`);
  }
  if (counts.mc !== spec.mc) errors.push(`Module ${moduleNum} MC mismatch: expected ${spec.mc}, found ${counts.mc}`);
  if (counts.fb !== spec.fb) errors.push(`Module ${moduleNum} FB mismatch: expected ${spec.fb}, found ${counts.fb}`);
  if (counts.ro !== spec.ro) errors.push(`Module ${moduleNum} RO mismatch: expected ${spec.ro}, found ${counts.ro}`);
  if (counts.sb !== spec.sb) errors.push(`Module ${moduleNum} SB mismatch: expected ${spec.sb}, found ${counts.sb}`);

  return {
    valid: errors.length === 0,
    errors,
    stats: { moduleNum, title: data.title, total: quizzes.length, counts }
  };
}

export function validateAllAvailableModules(modulesDir: string): { totalQuizzes: number; moduleStats: any[]; allValid: boolean } {
  let totalQuizzes = 0;
  const moduleStats: any[] = [];
  let allValid = true;

  console.log('--- VALIDATING MODULES ---');
  for (let m = 1; m <= 25; m++) {
    const fileName = `module-${String(m).padStart(2, '0')}.json`;
    const fullPath = path.join(modulesDir, fileName);
    if (!fs.existsSync(fullPath)) {
      console.log(`[PENDING] ${fileName} not yet created`);
      continue;
    }

    const res = validateModuleFile(fullPath, m);
    if (!res.valid) {
      console.error(`[FAIL] ${fileName}:`);
      res.errors.forEach((err) => console.error(`  - ${err}`));
      allValid = false;
    } else {
      console.log(`[PASS] ${fileName} (${res.stats.title}): ${res.stats.total} quizzes (MC:${res.stats.counts.mc}, FB:${res.stats.counts.fb}, RO:${res.stats.counts.ro}, SB:${res.stats.counts.sb})`);
      totalQuizzes += res.stats.total;
      moduleStats.push(res.stats);
    }
  }

  console.log(`Total quizzes verified so far: ${totalQuizzes}`);
  return { totalQuizzes, moduleStats, allValid };
}

// Direct execution CLI
const isDirectRun = process.argv[1]?.includes('validate-modules');
if (isDirectRun) {
  const targetDir = path.resolve(process.cwd(), 'src/data/modules');
  const result = validateAllAvailableModules(targetDir);
  if (!result.allValid) {
    process.exit(1);
  }
}
