import { create } from 'zustand';
import { getChatRooms, type DirectMessageRoomDto } from '@/lib/api/chats';

interface ChatStoreState {
  chatRooms: DirectMessageRoomDto[];
  loading: boolean;
  error: Error | null;
  hasNext: boolean;
  nextCursor: string | null;
  nextIdAfter: string | null;
  fetchChatRooms: (limit: number) => Promise<void>;
  fetchMoreChatRooms: (limit: number) => Promise<void>;
  updateChatRoom: (updatedRoom: DirectMessageRoomDto) => void;
  addChatRoom: (newRoom: DirectMessageRoomDto) => void;
  reset: () => void;
}

const initialState = {
  chatRooms: [],
  loading: false,
  error: null,
  hasNext: true,
  nextCursor: null,
  nextIdAfter: null,
};

export const useChatStore = create<ChatStoreState>((set, get) => ({
  ...initialState,
  fetchChatRooms: async (limit: number) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const response = await getChatRooms({ limit });
      set({
        chatRooms: response.rooms,
        hasNext: response.hasNext,
        nextCursor: response.nextCursor,
        nextIdAfter: response.nextIdAfter,
        loading: false,
      });
    } catch (error) {
      const err = error as Error;
      set({ error: err, loading: false });
      console.error("Failed to fetch chat rooms:", err);
    }
  },
  fetchMoreChatRooms: async (limit: number) => {
    const { loading, hasNext, nextCursor, nextIdAfter } = get();
    if (loading || !hasNext) return;

    set({ loading: true, error: null });
    try {
      const response = await getChatRooms({
        limit,
        cursor: nextCursor ?? undefined,
        idAfter: nextIdAfter ?? undefined,
      });
      set((state) => ({
        chatRooms: [...state.chatRooms, ...response.rooms],
        hasNext: response.hasNext,
        nextCursor: response.nextCursor,
        nextIdAfter: response.nextIdAfter,
        loading: false,
      }));
    } catch (error) {
      const err = error as Error;
      set({ error: err, loading: false });
      console.error("Failed to fetch more chat rooms:", err);
    }
  },
  updateChatRoom: (updatedRoom: DirectMessageRoomDto) => {
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.partner.userId === updatedRoom.partner.userId ? updatedRoom : room
      ),
    }));
  },
  addChatRoom: (newRoom: DirectMessageRoomDto) => {
    set((state) => ({
      chatRooms: state.chatRooms.some(room => room.partner.userId === newRoom.partner.userId)
        ? state.chatRooms
        : [newRoom, ...state.chatRooms],
    }));
  },
  reset: () => {
    set(initialState);
  },
}));