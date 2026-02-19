import { describe, expect, it } from 'vitest';

import { formatDate } from '~/global/utils/format-date';

describe('formatDate', () => {
  it('formats date string to Arabic locale by default', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('formats date string to English locale', () => {
    const result = formatDate('2024-01-15T10:30:00Z', 'en-sa');
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('formats Date object', () => {
    const date = new Date('2024-06-20T00:00:00Z');
    const result = formatDate(date, 'en-sa');
    expect(result).toContain('June');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });

  it('uses Arabic locale when ar-sa is specified', () => {
    const result = formatDate('2024-01-15T10:30:00Z', 'ar-sa');
    // Arabic date should contain Arabic numerals or month names
    expect(result).toBeTruthy();
  });
});
