import {create} from 'zustand';
import type {FeedDto, CursorParams} from '@/lib/api/types';
import {getDeletedFeedList} from '@/lib/api/feeds';
import {type PaginatedStore} from './types';
import {createPaginatedStoreActions} from "@/lib/stores/actions.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeletedFeedStore extends PaginatedStore<FeedDto, CursorParams> {}

export const useDeletedFeedStore = create<DeletedFeedStore>((set, get) => ({
  ...createPaginatedStoreActions({
    set, get,
    fetchApi: getDeletedFeedList,
    initialData: {
      params: {
        cursor: undefined,
        idAfter: undefined,
        limit: 10,
      }
    }
  }),
}));
