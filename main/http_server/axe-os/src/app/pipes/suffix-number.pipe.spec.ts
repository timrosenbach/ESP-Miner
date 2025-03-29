import { SuffixNumberPipe } from './suffix-number.pipe';

describe('SuffixNumberPipe', () => {
  let pipe: SuffixNumberPipe;
  
  beforeEach(() => {
    pipe = new SuffixNumberPipe();
  });

  it('should format values less than 1000', () => {
    expect(pipe.transform(999)).toBe('999');
    expect(pipe.transform(0)).toBe('0');
  });

  it('should format thousands', () => {
    expect(pipe.transform(1500)).toBe('1.5k');
    expect(pipe.transform(1000)).toBe('1k');
  });

  it('should format millions', () => {
    expect(pipe.transform(1000000)).toBe('1M');
    expect(pipe.transform(1234567)).toBe('1.23M');
  });

  it('should format billions', () => {
    expect(pipe.transform(1000000000)).toBe('1G');
    expect(pipe.transform(1234567890)).toBe('1.23G');
  });

  it('should format trillions', () => {
    expect(pipe.transform(1000000000000)).toBe('1T');
    expect(pipe.transform(1234567890123)).toBe('1.23T');
  });

  it('should format petas', () => {
    expect(pipe.transform(1000000000000000)).toBe('1P');
  });

  it('should format exas', () => {
    expect(pipe.transform(1000000000000000000)).toBe('1E');
  });
});
