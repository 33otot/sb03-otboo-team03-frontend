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
  items: JSON.parse(localStorage.getItem(KEY) || '[]'),
  push: (p) => {
    const rest = get().items.filter(i => i.id !== p.id);
    const next = [p, ...rest].slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(next));
    set({ items: next });
  },
  remove: (id) => {
    const next = get().items.filter(i => i.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    set({ items: next });
  },
  clear: () => { localStorage.removeItem(KEY); set({ items: [] }); }
}));
