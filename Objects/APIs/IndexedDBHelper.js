export class IndexedDBHelper {
    static #instance = null; // 私有靜態實例

    static getInstance() {
        if (!IndexedDBHelper.#instance) {
            const helper = new IndexedDBHelper();
            helper.init();
            IndexedDBHelper.#instance = helper;
        }
        return IndexedDBHelper.#instance;
    }

    constructor(dbName = 'GameDB') {
        if (IndexedDBHelper.#instance) {
            throw new Error("Singleton class cannot be instantiated more than once.");
        }
        this.dbName = dbName;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('LeaderboardByScore')) {
                    db.createObjectStore('LeaderboardByScore', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('LeaderboardByAccuracy')) {
                    db.createObjectStore('LeaderboardByAccuracy', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    async addPlayer(data, mode = 'both') {
        if (mode === 'score' || mode === 'both') {
            await this.#addToDB('LeaderboardByScore', data);
        }
        if (mode === 'accuracy' || mode === 'both') {
            await this.#addToDB('LeaderboardByAccuracy', data);
        }
    }

    #addToDB(storeName, data) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([storeName], 'readwrite');
            const store = tx.objectStore(storeName);
            store.add(data);
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e.target.error);
        });
    }

    async getSortedLeaderboard(mode = 'LeaderboardByScore', limit = 10) {
        const storeName = mode === 'accuracy' ? 'LeaderboardByAccuracy' : 'LeaderboardByScore';
        const data = await this.#getAll(storeName);
        const sorted = data.sort((a, b) => b[mode] - a[mode]);

        return sorted.slice(0, limit);
    }
    getAllDataByName(mode = 'LeaderboardByScore') {
        const storeName = mode === 'accuracy' ? 'LeaderboardByAccuracy' : 'LeaderboardByScore';
        return this.#getAll(storeName).then(data => data.map(entry => entry.name));
    }

    #getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([storeName], 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    async clearAllData() {
            const storeNames = ['LeaderboardByScore', 'LeaderboardByAccuracy'];

            for (const storeName of storeNames) {
                await new Promise((resolve, reject) => {
                    const tx = this.db.transaction([storeName], 'readwrite');
                    const store = tx.objectStore(storeName);
                    const request = store.clear();

                    request.onsuccess = () => resolve();
                    request.onerror = (e) => reject(e.target.error);
                });
            }
        }
    async isDuplicateFace(inputDescriptor, threshold = 0.6, mode = 'score') {
        const storeName = mode === 'accuracy' ? 'LeaderboardByAccuracy' : 'LeaderboardByScore';
        const allData = await this.#getAll(storeName);

        for (const entry of allData) {
            if (!entry.descriptor) continue;
            const dist = this.#euclideanDistance(entry.descriptor, inputDescriptor);
            if (dist < threshold) {
                return { isDuplicate: true, existing: entry, distance: dist };
            }
        }

        return { isDuplicate: false };
    }

  #euclideanDistance(a, b) {
      return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
  }
}
