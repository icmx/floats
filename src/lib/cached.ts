/**
 * Basic manual cache for API calls and initial calculations (I use it for cross-rates)
 *
 * There is no TTL currently, which is okay for my scope (currency rates updates once in a day).
 * It's much simpler for user to just refresh the page (in such a rare case when user has active tab for >24h)
 *
 * @todo Maybe I should make a separate persistent store (Zustand+LS middleware) with TTL to speed up loading, not necceary for thi time
 */
export class Cached<T> {
  private _entries: Map<string, Promise<T>>;

  constructor() {
    this._entries = new Map();
  }

  get(key: string): Promise<T> | null {
    return this._entries.get(key) ?? null;
  }

  set(key: string, value: Promise<T>): void {
    this._entries.set(key, value);
  }

  resolve(key: string, onMiss: () => Promise<T>): Promise<T> {
    const existing = this.get(key);

    if (existing) {
      return existing;
    }

    const missing = onMiss().catch((rejected) => {
      this._entries.delete(key);

      throw rejected;
    });

    this.set(key, missing);

    return missing;
  }
}
