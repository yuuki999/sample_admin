"use client";

interface StoredData<T> {
  value: T;
  expiresAt: number | null;
}

export default class LocalStorageManager {
  /**
   * キーと値を保存します。有効期限も設定できます。
   * @param key 保存するキー
   * @param value 保存する値
   * @param ttl 有効期限（ミリ秒）。指定しない場合は無期限。
   */
  static set<T>(key: string, value: T, ttl?: number): void {
    const data: StoredData<T> = {
      value: value,
      expiresAt: ttl ? Date.now() + ttl : null,
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * キーに対応する値を取得します。
   * @param key 取得するキー
   * @returns キーに対応する値。有効期限が過ぎている場合は null。
   */
  static get<T>(key: string): T | null {
    const dataString = localStorage.getItem(key);
    if (!dataString) {
      return null;
    }

    const data: StoredData<T> = JSON.parse(dataString);
    if (data.expiresAt && Date.now() > data.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return data.value;
  }

  /**
   * キーに対応するデータの残りの有効期限（TTL）をミリ秒単位で取得します。
   * @param key 取得するキー
   * @returns 残りの有効期限（ミリ秒）。有効期限が過ぎている場合や設定されていない場合は null。
   */
  static getRemainingTTL(key: string): number | null {
    const dataString = localStorage.getItem(key);
    if (!dataString) {
      return null;
    }

    const data: StoredData<any> = JSON.parse(dataString);
    if (!data.expiresAt) {
      return null;
    }

    const remainingTime = data.expiresAt - Date.now();
    if (remainingTime <= 0) {
      localStorage.removeItem(key);
      return null;
    }
    return remainingTime;
  }

  /**
   * キーに対応するデータを削除します。
   * @param key 削除するキー
   */
  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * すべてのデータを削除します。
   */
  static clear(): void {
    localStorage.clear();
  }
}
