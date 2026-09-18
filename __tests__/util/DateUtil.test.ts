import { formatDate } from '../../util/DateUtil';

describe('DateUtil', () => {
  describe('formatDate', () => {
    it('formats a standard ISO date string', () => {
      const result = formatDate('2024-01-15');
      // Note: month name depends on locale, but in most environments:
      expect(result).toMatch(/15.*January.*2024/);
    });

    it('formats another date correctly', () => {
      const result = formatDate('2023-12-25');
      expect(result).toMatch(/25.*December.*2023/);
    });

    it('formats a date at the start of the year', () => {
      const result = formatDate('2024-01-01');
      expect(result).toMatch(/1.*January.*2024/);
    });

    it('handles ISO datetime strings', () => {
      const result = formatDate('2024-06-15T10:30:00Z');
      expect(result).toMatch(/15.*June.*2024/);
    });

    it('returns day month year format', () => {
      const result = formatDate('2024-03-05');
      // Should be "5 March 2024" format
      expect(result).toMatch(/\d+\s\w+\s\d{4}/);
    });
  });
});
