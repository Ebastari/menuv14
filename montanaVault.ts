const DB_NAME = 'MontanaVault';
const DB_VERSION = 3;
const HISTORY_STORE = 'history';
const DASHBOARD_CACHE_STORE = 'dashboardCache';

export interface DashboardCacheRecord<T> {
  key: string;
  value: T;
  updatedAt: number;
}

export const openMontanaVault = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        db.createObjectStore(HISTORY_STORE, { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(DASHBOARD_CACHE_STORE)) {
        db.createObjectStore(DASHBOARD_CACHE_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };

    request.onerror = () => reject(request.error || new Error('Failed to open MontanaVault.'));
    request.onblocked = () => reject(new Error('MontanaVault upgrade was blocked by another tab.'));
  });
};

export const getHistoryEntries = async <T>(): Promise<T[]> => {
  const db = await openMontanaVault();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(HISTORY_STORE, 'readonly');
    const store = transaction.objectStore(HISTORY_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve((request.result as T[]) || []);
    request.onerror = () => reject(request.error || new Error('Failed to read Montana history entries.'));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error || new Error('History transaction failed.'));
  });
};

export const getDashboardCache = async <T>(key: string): Promise<DashboardCacheRecord<T> | null> => {
  const db = await openMontanaVault();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DASHBOARD_CACHE_STORE, 'readonly');
    const store = transaction.objectStore(DASHBOARD_CACHE_STORE);
    const request = store.get(key);

    request.onsuccess = () => resolve((request.result as DashboardCacheRecord<T> | undefined) || null);
    request.onerror = () => reject(request.error || new Error(`Failed to read dashboard cache for ${key}.`));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error || new Error('Dashboard cache read transaction failed.'));
  });
};

export const setDashboardCache = async <T>(key: string, value: T): Promise<void> => {
  const db = await openMontanaVault();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DASHBOARD_CACHE_STORE, 'readwrite');
    const store = transaction.objectStore(DASHBOARD_CACHE_STORE);

    store.put({
      key,
      value,
      updatedAt: Date.now(),
    });

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error || new Error(`Failed to persist dashboard cache for ${key}.`));
  });
};