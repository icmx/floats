export class ApiCache<T> {
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

    const missing = onMiss();

    this.set(key, missing);

    return missing;
  }
}
