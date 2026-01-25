export class ApiCache<T> {
  private _entries: Map<string, T>;

  constructor() {
    this._entries = new Map();
  }

  get(key: string): T | null {
    return this._entries.get(key) || null;
  }

  set(key: string, value: T): void {
    this._entries.set(key, value);
  }

  async resolve(key: string, onMiss: () => Promise<T>): Promise<T> {
    const entry = this.get(key);

    if (entry) {
      return entry;
    }

    const resolved = await onMiss();

    this.set(key, resolved);

    return resolved;
  }
}
