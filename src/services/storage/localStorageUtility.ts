import { EStorageKeys } from './storageKeys';

class LocalStorageUtility {
    private storage: Storage = localStorage;

    private constructor() {}

    public static readonly instance: LocalStorageUtility = new LocalStorageUtility();

    setItem<T>(key: EStorageKeys, value: T): void {
        try {
            const jsonValue = JSON.stringify(value);

            this.storage.setItem(key, jsonValue);
        } catch (error) {
            console.error(`Ошибка при добавлении ${key}:`, error);
        }
    }

    getItem<T>(key: EStorageKeys): T | null {
        try {
            const rawValue = this.storage.getItem(key);

            return rawValue !== null ? JSON.parse(rawValue) : null;
        } catch (error) {
            console.error(`Не удалось получить ${key}:`, error);

            return null;
        }
    }

    removeItem(key: EStorageKeys): void {
        this.storage.removeItem(key);
    }

    clear(): void {
        this.storage.clear();
    }
}

export const LocalStorageUtil = LocalStorageUtility.instance;
