import { ScanHistoryItem } from '../types';

const HISTORY_KEY = 'scamshield_scan_history_v1';
const THEME_KEY = 'scamshield_theme';

export const storageService = {
  // Theme Management
  getTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return 'dark'; // Dark cyber SaaS by default
  },

  setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  },

  // Scan History Management (Stored only locally on client browser)
  getHistory(): ScanHistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveScan(item: ScanHistoryItem): void {
    try {
      const current = this.getHistory();
      // Keep up to 50 latest scans locally
      const updated = [item, ...current.filter(i => i.id !== item.id)].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save scan to local storage:', e);
    }
  },

  deleteScan(id: string): void {
    try {
      const current = this.getHistory();
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete scan from local storage:', e);
    }
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  }
};
