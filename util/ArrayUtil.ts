
export function safeArray<T>(data: T[] | undefined | null): T[] {
    return data ?? [];
  }