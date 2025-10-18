import { create } from 'zustand';
import type { CursorParams, NotificationDto } from '@/lib/api/types';
import { deleteAllByUserId, getNotifications } from '@/lib/api/notifications';
import type { PaginatedStore } from './types';
import { createPaginatedStoreActions } from '@/lib/stores/actions.ts';

interface NotificationStore extends PaginatedStore<NotificationDto, CursorParams> {
  deleteAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  ...createPaginatedStoreActions({
    set,
    get,
    fetchApi: getNotifications,
    initialData: {
      params: {
        limit: 20,
      },
    },
  }),

  deleteAll: async () => {
    await deleteAllByUserId();
    get().clear();
  },
}));