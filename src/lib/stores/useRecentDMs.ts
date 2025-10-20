// useRecentDMs.ts
import { create } from 'zustand';

export type Peer = { id: string; name: string; profileImageUrl?: string };

type S = {
  items: Peer[];
  push: (p: Peer) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const KEY = 'recentDMs:v1';

export const useRecentDMs = create<S>((set, get) => ({
  items: (() => {
    try {
      const stored = localStorage.getItem(KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),
  push: (p) => {
    const rest = get().items.filter(i => i.id !== p.id);
    const next = [p, ...rest].slice(0, 50);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to save recent DMs:', error);
    }
    set({ items: next });
  },
  remove: (id) => {
    const next = get().items.filter(i => i.id !== id);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to save recent DMs:', error);
    }
    set({ items: next });
  },
  clear: () => { 
    try {
      localStorage.removeItem(KEY);
    } catch (error) {
      console.warn('Failed to clear recent DMs:', error);
    }
    set({ items: [] });
  }
}));
