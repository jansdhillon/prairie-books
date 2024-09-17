export function fixOneToOne<T>(objectOrNull: T[]): T | null {
    return (objectOrNull as T) || null;
  }
