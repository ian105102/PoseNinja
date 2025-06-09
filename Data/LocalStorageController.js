// Data/LocalStorageController.js
export const LocalStorageController = {
  // 錨點 key
  portraitKey:    'myGamePortrait',
  leaderboardKey: 'myGameLeaderboard',

  /** 存頭像（Base64） */
  savePortrait(b64) {
    if (b64) window.localStorage.setItem(this.portraitKey, b64);
  },
  /** 讀頭像 */
  loadPortrait() {
    return window.localStorage.getItem(this.portraitKey);
  },

  /** 讀排行榜陣列 */
  loadLeaderboard() {
    const raw = window.localStorage.getItem(this.leaderboardKey);
    if (!raw) return [];
    try { return JSON.parse(raw); }
    catch { return []; }
  },
  /** 存排行榜陣列 */
  saveLeaderboard(list) {
    window.localStorage.setItem(this.leaderboardKey, JSON.stringify(list));
  },

  /** 新增一筆排行榜紀錄 */
  addEntry({ name, score, mode, portrait }) {
    const list = this.loadLeaderboard();
    list.push({ name, score, mode, portrait, timestamp: Date.now() });
    // 依 score 排序、只留前 50 筆
    list.sort((a, b) => b.score - a.score);
    if (list.length > 50) list.length = 50;
    this.saveLeaderboard(list);
  }
};
