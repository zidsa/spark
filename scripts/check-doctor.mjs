const isRecord = value => typeof value === 'object' && value !== null && !Array.isArray(value);

export const validateDoctorReport = report => {
  if (
    !isRecord(report) ||
    report.schemaVersion !== 3 ||
    report.mode !== 'full' ||
    report.reactDetected !== true ||
    report.ok !== true ||
    report.diff !== null ||
    report.error !== null
  ) {
    return 'report is missing required full-scan fields';
  }

  if (!Array.isArray(report.diagnostics) || report.diagnostics.length > 0) {
    return `report contains ${report.diagnostics?.length ?? 'invalid'} finding(s)`;
  }

  const summary = report.summary;
  if (
    !isRecord(summary) ||
    summary.score !== 100 ||
    summary.errorCount !== 0 ||
    summary.warningCount !== 0 ||
    summary.affectedFileCount !== 0 ||
    summary.totalDiagnosticCount !== 0
  ) {
    return 'report summary is not a clean 100/100 scan';
  }

  if (!Array.isArray(report.projects) || report.projects.length === 0) {
    return 'report contains no scanned projects';
  }

  for (const project of report.projects) {
    if (
      !isRecord(project) ||
      project.complete !== true ||
      !Array.isArray(project.skippedChecks) ||
      project.skippedChecks.length > 0 ||
      !Array.isArray(project.diagnostics) ||
      project.diagnostics.length > 0 ||
      !isRecord(project.score) ||
      project.score.score !== 100
    ) {
      return 'a project scan is incomplete, skipped checks, has findings, or is below 100/100';
    }
  }

  return null;
};

const run = async () => {
  const scan = Bun.spawn(
    ['bunx', '--bun', '-y', 'react-doctor@latest', '.', '--json', '--scope', 'full'],
    { stdout: 'pipe', stderr: 'pipe' },
  );
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(scan.stdout).text(),
    new Response(scan.stderr).text(),
    scan.exited,
  ]);

  if (exitCode !== 0) {
    process.stdout.write(stdout);
    process.stderr.write(`React Doctor scanner failed with exit code ${exitCode}.\n${stderr}`);
    process.exitCode = 1;
    return;
  }

  let report;
  try {
    report = JSON.parse(stdout);
  } catch {
    process.stdout.write(stdout);
    process.stderr.write(`React Doctor scanner returned invalid JSON.\n${stderr}`);
    process.exitCode = 1;
    return;
  }

  const failure = validateDoctorReport(report);
  if (failure) {
    process.stdout.write(stdout);
    process.stderr.write(`React Doctor strict gate failed: ${failure}.\n${stderr}`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    `React Doctor strict gate passed: score 100/100, 0 findings across ${report.projects.length} project(s).\n`,
  );
};

if (import.meta.main) {
  await run();
}
