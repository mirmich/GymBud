import { addition, subtraction } from '../../util/NumberUtil';

describe('NumberUtil', () => {
  describe('addition', () => {
    it('adds two positive numbers', () => {
      expect(addition(2, 3)).toBe(5);
    });

    it('adds zero', () => {
      expect(addition(5, 0)).toBe(5);
    });

    it('adds negative numbers', () => {
      expect(addition(-2, -3)).toBe(-5);
    });

    it('handles decimal numbers', () => {
      expect(addition(1.5, 2.5)).toBe(4);
    });

    it('handles mixed positive and negative', () => {
      expect(addition(10, -3)).toBe(7);
    });
  });

  describe('subtraction', () => {
    it('subtracts two positive numbers', () => {
      expect(subtraction(5, 3)).toBe(2);
    });

    it('subtracts zero', () => {
      expect(subtraction(5, 0)).toBe(5);
    });

    it('subtracts resulting in negative', () => {
      expect(subtraction(3, 5)).toBe(-2);
    });

    it('handles decimal numbers', () => {
      expect(subtraction(5.5, 2.5)).toBe(3);
    });

    it('handles negative numbers', () => {
      expect(subtraction(-2, -3)).toBe(1);
    });
  });
});
