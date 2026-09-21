import StrengthLevelService from '../../services/StrengthLevelService';

describe('StrengthLevelService', () => {
  describe('getStrengthLevel', () => {
    // Using Bench Press at 100kg bodyweight:
    // thresholds: [71, 94, 122, 153, 187]
    // With 0 and Infinity added: [0, 71, 94, 122, 153, 187, Infinity]
    // Sliding windows: [0,71], [71,94], [94,122], [122,153], [153,187], [187,Inf]

    it('returns a valid strength level for a beginner bench press', async () => {
      const result = await StrengthLevelService.getStrengthLevel('Bench Press', 100, 80);
      expect(result).toHaveProperty('index');
      expect(result).toHaveProperty('position');
      expect(result.index).toBeGreaterThanOrEqual(0);
    });

    it('returns correct index for a value in the novice range', async () => {
      // 100kg bodyweight, 100kg 1RM → should be in [94,122] range → index 2
      const result = await StrengthLevelService.getStrengthLevel('Bench Press', 100, 100);
      expect(result.index).toBe(2);
    });

    it('returns correct index for a value in the intermediate range', async () => {
      // 100kg bodyweight, 140kg 1RM → should be in [122,153] range → index 3
      const result = await StrengthLevelService.getStrengthLevel('Bench Press', 100, 140);
      expect(result.index).toBe(3);
    });

    it('caps position at 105% when exceeding elite threshold', async () => {
      // 100kg bodyweight, 250kg 1RM → way past elite
      const result = await StrengthLevelService.getStrengthLevel('Bench Press', 100, 250);
      expect(result.position).toBe(105 / 100);
    });

    it('handles case-insensitive exercise names', async () => {
      const result = await StrengthLevelService.getStrengthLevel('bench press', 100, 100);
      expect(result).toHaveProperty('index');
      expect(result).toHaveProperty('position');
    });

    it('position is a ratio between 0 and 1.05', async () => {
      const result = await StrengthLevelService.getStrengthLevel('Bench Press', 80, 80);
      expect(result.position).toBeGreaterThanOrEqual(0);
      expect(result.position).toBeLessThanOrEqual(1.05);
    });
  });
});
