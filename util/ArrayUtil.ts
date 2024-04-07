
export function safeArray<T>(data: T[] | undefined | null): T[] {
    return data ?? [];
  }

  export function slidingWindow<T>(arr: T[], size: number, step: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length - size + 1; i += step) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}