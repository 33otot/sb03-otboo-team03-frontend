import { create } from 'zustand';
import { getChatRooms, type DirectMessageRoomDto, type DirectMessageRoomListResponse } from '@/lib/api/chats';

interface ChatStoreState {
  chatRooms: DirectMessageRoomDto[];
  loading: boolean;
  error: Error | null;
  fetchChatRooms: () => Promise<void>;
  updateChatRoom: (updatedRoom: DirectMessageRoomDto) => void;
  addChatRoom: (newRoom: DirectMessageRoomDto) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  chatRooms: [],
  loading: false,
  error: null,
  fetchChatRooms: async () => {
    set({ loading: true, error: null });
    try {
      const response: DirectMessageRoomListResponse = await getChatRooms();
      set({ chatRooms: response.rooms, loading: false });
    } catch (error) {
      const err = error as Error;
      set({ error: err, loading: false });
      console.error("Failed to fetch chat rooms:", err);
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
      chatRooms: [newRoom, ...state.chatRooms], // Add new room to the top
    }));
  },
}));