import { safeArray, slidingWindow } from '../../util/ArrayUtil';

describe('ArrayUtil', () => {
  describe('safeArray', () => {
    it('returns empty array for null', () => {
      expect(safeArray(null)).toEqual([]);
    });

    it('returns empty array for undefined', () => {
      expect(safeArray(undefined)).toEqual([]);
    });

    it('returns the same array if already valid', () => {
      const arr = [1, 2, 3];
      expect(safeArray(arr)).toBe(arr);
    });

    it('returns empty array for empty array input', () => {
      expect(safeArray([])).toEqual([]);
    });
  });

  describe('slidingWindow', () => {
    it('returns correct windows with size 2 and step 1', () => {
      const result = slidingWindow([1, 2, 3, 4, 5], 2, 1);
      expect(result).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
      ]);
    });

    it('returns correct windows with size 3 and step 1', () => {
      const result = slidingWindow([1, 2, 3, 4], 3, 1);
      expect(result).toEqual([
        [1, 2, 3],
        [2, 3, 4],
      ]);
    });

    it('returns correct windows with size 2 and step 2', () => {
      const result = slidingWindow([1, 2, 3, 4], 2, 2);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it('returns empty array when window size exceeds array length', () => {
      const result = slidingWindow([1, 2], 5, 1);
      expect(result).toEqual([]);
    });

    it('returns empty array for empty input', () => {
      const result = slidingWindow([], 2, 1);
      expect(result).toEqual([]);
    });

    it('returns single window when size equals array length', () => {
      const result = slidingWindow([1, 2, 3], 3, 1);
      expect(result).toEqual([[1, 2, 3]]);
    });
  });
});
