import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const { validateDoctorReport } = await import(resolve('scripts/check-doctor.mjs'));

const cleanReport = {
  schemaVersion: 3,
  mode: 'full',
  reactDetected: true,
  ok: true,
  diff: null,
  diagnostics: [],
  summary: {
    errorCount: 0,
    warningCount: 0,
    affectedFileCount: 0,
    totalDiagnosticCount: 0,
    score: 100,
  },
  projects: [
    {
      diagnostics: [],
      score: { score: 100 },
      skippedChecks: [],
      complete: true,
    },
  ],
  error: null,
};

describe('validateDoctorReport', () => {
  it('accepts a complete clean report', () => {
    expect(validateDoctorReport(cleanReport)).toBeNull();
  });

  it('rejects missing or non-clean scan results', () => {
    const failedReports = [
      undefined,
      { ...cleanReport, mode: 'changed' },
      { ...cleanReport, summary: { ...cleanReport.summary, score: 99 } },
      {
        ...cleanReport,
        diagnostics: [{ severity: 'warning' }],
      },
      {
        ...cleanReport,
        projects: [{ ...cleanReport.projects[0], skippedChecks: ['lint'] }],
      },
      {
        ...cleanReport,
        projects: [{ ...cleanReport.projects[0], complete: false }],
      },
    ];

    for (const report of failedReports) {
      expect(validateDoctorReport(report)).not.toBeNull();
    }
  });
});
