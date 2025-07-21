class OfflineStorage {
  private dbName = 'CatholicFaithDefender';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for different content types
        if (!db.objectStoreNames.contains('qa')) {
          db.createObjectStore('qa');
        }
        if (!db.objectStoreNames.contains('prayers')) {
          db.createObjectStore('prayers');
        }
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents');
        }
        if (!db.objectStoreNames.contains('bible')) {
          db.createObjectStore('bible');
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          db.createObjectStore('bookmarks');
        }
      };
    });
  }

  async setItem(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('Database not initialized'));
      
      const transaction = this.db.transaction(['qa', 'prayers', 'documents', 'bible', 'bookmarks'], 'readwrite');
      const store = transaction.objectStore(this.getStoreName(key));
      const request = store.put(value, key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getItem(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('Database not initialized'));
      
      const transaction = this.db.transaction([this.getStoreName(key)], 'readonly');
      const store = transaction.objectStore(this.getStoreName(key));
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private getStoreName(key: string): string {
    if (key === 'qa') return 'qa';
    if (key === 'prayers') return 'prayers';
    if (key === 'documents') return 'documents';
    if (key === 'bible') return 'bible';
    return 'bookmarks';
  }
}

export const offlineStorage = new OfflineStorage();
