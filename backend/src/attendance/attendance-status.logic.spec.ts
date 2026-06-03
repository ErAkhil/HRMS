import {
  resolveCheckOutStatus,
  shouldCreateAbsentRecord,
  shouldCreateOnLeaveRecord,
  shouldOverrideStatusToOnLeave,
} from './attendance-status.logic';

describe('attendance smart status logic', () => {
  it('gives ON_LEAVE precedence over existing non-checkin ABSENT record', () => {
    expect(shouldOverrideStatusToOnLeave('ABSENT', true, false, false)).toBe(true);
  });

  it('creates ABSENT for no attendance and no approved leave', () => {
    expect(shouldCreateAbsentRecord(false, false)).toBe(true);
    expect(shouldCreateOnLeaveRecord(false, false)).toBe(false);
  });

  it('creates ON_LEAVE for approved leave with no attendance', () => {
    expect(shouldCreateOnLeaveRecord(false, true)).toBe(true);
    expect(shouldCreateAbsentRecord(false, true)).toBe(false);
  });

  it('marks HALF_DAY on checkout when hours are below threshold for PRESENT/LATE/REMOTE', () => {
    expect(resolveCheckOutStatus('PRESENT', 3.5, 4)).toBe('HALF_DAY');
    expect(resolveCheckOutStatus('LATE', 3.99, 4)).toBe('HALF_DAY');
    expect(resolveCheckOutStatus('REMOTE', 2, 4)).toBe('HALF_DAY');
  });

  it('does not change status on checkout when hours meet threshold or status is ON_LEAVE', () => {
    expect(resolveCheckOutStatus('PRESENT', 4, 4)).toBe('PRESENT');
    expect(resolveCheckOutStatus('ON_LEAVE', 2, 4)).toBe('ON_LEAVE');
  });
});
