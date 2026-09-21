import { calculatePr } from '../../util/PersonalRecordsUtil';

describe('PersonalRecordsUtil', () => {
  describe('calculatePr', () => {
    // Guard clauses
    it('returns 0 when reps is 0', () => {
      expect(calculatePr(100, 0)).toBe(0);
    });

    it('returns 0 when reps is negative', () => {
      expect(calculatePr(100, -1)).toBe(0);
    });

    it('returns 0 when weight is 0', () => {
      expect(calculatePr(0, 5)).toBe(0);
    });

    it('returns 0 when weight is negative', () => {
      expect(calculatePr(-50, 5)).toBe(0);
    });

    // Brzycki formula: reps 1-8
    it('returns exact weight for 1 rep (Brzycki)', () => {
      const result = calculatePr(100, 1);
      expect(result).toBeCloseTo(100, 0);
    });

    it('uses Brzycki formula for 5 reps', () => {
      // Brzycki: weight / (1.0278 - 0.0278 * reps)
      const expected = 100 / (1.0278 - 0.0278 * 5);
      const result = calculatePr(100, 5);
      expect(result).toBeCloseTo(expected, 4);
    });

    it('uses Brzycki formula for 8 reps', () => {
      const expected = 80 / (1.0278 - 0.0278 * 8);
      const result = calculatePr(80, 8);
      expect(result).toBeCloseTo(expected, 4);
    });

    // Mayhew formula: reps 9-10
    it('uses Mayhew formula for 9 reps', () => {
      // Mayhew: (100 * weight) / (52.2 + 41.9 * exp(-0.055 * reps))
      const expected = (100 * 80) / (52.2 + 41.9 * Math.exp(-0.055 * 9));
      const result = calculatePr(80, 9);
      expect(result).toBeCloseTo(expected, 4);
    });

    it('uses Mayhew formula for 10 reps', () => {
      const expected = (100 * 60) / (52.2 + 41.9 * Math.exp(-0.055 * 10));
      const result = calculatePr(60, 10);
      expect(result).toBeCloseTo(expected, 4);
    });

    // Epley formula: reps 11+
    it('uses Epley formula for 11 reps', () => {
      // Epley: weight * (1 + 0.0333 * reps)
      const expected = 60 * (1 + 0.0333 * 11);
      const result = calculatePr(60, 11);
      expect(result).toBeCloseTo(expected, 4);
    });

    it('uses Epley formula for 20 reps', () => {
      const expected = 50 * (1 + 0.0333 * 20);
      const result = calculatePr(50, 20);
      expect(result).toBeCloseTo(expected, 4);
    });

    // General properties
    it('1RM is always >= the weight used', () => {
      expect(calculatePr(100, 1)).toBeGreaterThanOrEqual(100);
      expect(calculatePr(80, 5)).toBeGreaterThan(80);
      expect(calculatePr(60, 10)).toBeGreaterThan(60);
    });

    it('higher reps with same weight yields higher 1RM estimate', () => {
      const rm5 = calculatePr(100, 5);
      const rm8 = calculatePr(100, 8);
      expect(rm8).toBeGreaterThan(rm5);
    });
  });
});
