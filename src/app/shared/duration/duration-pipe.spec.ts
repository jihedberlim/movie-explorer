import { DurationPipe } from './duration-pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('should show hours and minutes', () => {
    expect(pipe.transform(142)).toBe('2h 22min');
  });

  it('should show only minutes when it is less than one hour', () => {
    expect(pipe.transform(45)).toBe('45min');
  });

  it('should show only hours when there are no extra minutes', () => {
    expect(pipe.transform(120)).toBe('2h');
  });

  it('should show nothing when the runtime is unknown', () => {
    expect(pipe.transform(0)).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
