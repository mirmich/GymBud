import UnitConversionUtil from '../../util/UnitConversionUtil';

describe('UnitConversionUtil', () => {
  describe('toPresent', () => {
    it('returns correct UnitOfExercise shape', () => {
      const result = UnitConversionUtil.toPresent(80, 10, 0);
      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('units');
      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('reps');
      expect(result).toHaveProperty('text');
    });

    it('generates correct key from index', () => {
      expect(UnitConversionUtil.toPresent(80, 10, 0).key).toBe('0');
      expect(UnitConversionUtil.toPresent(80, 10, 5).key).toBe('5');
    });

    it('sets units to kg', () => {
      const result = UnitConversionUtil.toPresent(80, 10, 0);
      expect(result.units).toBe('kg');
    });

    it('preserves weight as amount', () => {
      const result = UnitConversionUtil.toPresent(80, 10, 0);
      expect(result.amount).toBe(80);
    });

    it('preserves reps', () => {
      const result = UnitConversionUtil.toPresent(80, 10, 0);
      expect(result.reps).toBe(10);
    });

    it('formats text as 1-indexed display string', () => {
      const result = UnitConversionUtil.toPresent(80, 10, 0);
      expect(result.text).toBe('1    80 kg    10 reps');
    });

    it('uses 1-indexed position in text', () => {
      const result = UnitConversionUtil.toPresent(60, 8, 2);
      expect(result.text).toBe('3    60 kg    8 reps');
    });

    it('handles decimal weights', () => {
      const result = UnitConversionUtil.toPresent(82.5, 5, 0);
      expect(result.text).toBe('1    82.5 kg    5 reps');
      expect(result.amount).toBe(82.5);
    });
  });
});
