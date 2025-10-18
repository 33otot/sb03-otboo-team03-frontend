import { create } from 'zustand';
import { getDirectMessages, type DirectMessageDto, type DirectMessageListParams } from '@/lib/api/messages';

interface DirectMessageStoreState {
  messages: DirectMessageDto[];
  params: DirectMessageListParams;
  loading: boolean;
  error: Error | null;
  hasNext: boolean;
  fetchMessages: (initialFetch?: boolean) => Promise<void>;
  fetchMore: () => Promise<void>;
  add: (message: DirectMessageDto) => void;
  updateParams: (newParams: Partial<DirectMessageListParams>) => void;
  clearData: () => void;
}

export const useDirectMessageStore = create<DirectMessageStoreState>((set, get) => ({
  messages: [],
  params: { userId: '', limit: 20 },
  loading: false,
  error: null,
  hasNext: true,

  fetchMessages: async (initialFetch = true) => {
    const { params, loading, hasNext } = get();
    if (loading || (!hasNext && !initialFetch)) return;

    const userIdAtRequest = params.userId;
    set({ loading: true, error: null });
    try {
      const response = await getDirectMessages(params);
      set((state) => {
        if (state.params.userId !== userIdAtRequest) return state; // stale 응답 무시
        const next = initialFetch ? response.data : [...state.messages, ...response.data];
        return {
          messages: next,
          hasNext: response.hasNext,
          params: { ...state.params, cursor: response.nextCursor, idAfter: response.nextIdAfter },
          loading: false,
        }
      });
    } catch (error) {
      const err = error as Error;
      set({ error: err, loading: false });
      console.error("Failed to fetch direct messages:", err);
    }
  },

  fetchMore: () => {
    return get().fetchMessages(false);
  },

  add: (message: DirectMessageDto) => {
    set((state) => {
      if (state.messages.some(m => m.id === message.id)) return state;
      return { messages: [...state.messages, message] };
    });
  },

  updateParams: (newParams: Partial<DirectMessageListParams>) => {
    set((state) => ({
      params: { ...state.params, ...newParams },
      messages: [], // 파라미터 변경 시 데이터 초기화
      hasNext: true,
      error: null,
    }));
    get().fetchMessages(); // 파라미터 변경 후 다시 불러오기
  },

  clearData: () => {
    set({
      messages: [],
      params: { userId: '', limit: 20 },
      loading: false,
      error: null,
      hasNext: true,
    });
  },
}));
