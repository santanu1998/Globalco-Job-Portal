import { describe, expect, it } from 'vitest';
import { demoJobs } from './data';

describe('demo jobs', () => {
  it('contains Globalco assessment job', () => {
    expect(demoJobs.some((job) => job.companyName === 'Globalco')).toBe(true);
  });
});
