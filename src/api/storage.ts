export enum StorageKey {
  user = "@auth/user",
  token = "@auth/token",
}

export class StorageService {
  save<T = any>(object: T, key: StorageKey) {
    if (typeof object === "object") {
      window.localStorage.setItem(key, JSON.stringify(object));
    } else if (typeof object === "string") {
      window.localStorage.setItem(key, object);
    }
  }

  get<T = any>(key: StorageKey): T | null {
    const result = window.localStorage.getItem(key);
    if (result !== null) {
      try {
        return JSON.parse(result);
      } catch {
        return (result as any) as T;
      }
    } else {
      return null as any;
    }
  }

  delete(key: StorageKey) {
    window.localStorage.removeItem(key);
  }

  deleteAll() {
    Object.values(StorageKey).forEach((key) => this.delete(key));
  }
}
