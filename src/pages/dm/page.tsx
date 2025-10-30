import { useState } from 'react';
import { ChatRoomList } from '@/components/dm/ChatRoomList';
import { ConversationView } from '@/components/dm/ConversationView';
import { DmPlaceholder } from '@/components/dm/DmPlaceholder';
import { Plus } from 'lucide-react';
import { UserListPopup } from '@/components/dm/UserListPopup';
import type { UserDto } from '@/lib/api/types';
import { getDirectMessages } from '@/lib/api/messages';
import { toast } from 'sonner';
import { useChatStore } from '@/lib/stores/useChatStore';
import type { DirectMessageRoomDto } from '@/lib/api/chats';

export default function DmPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const { updateChatRoom, addChatRoom } = useChatStore();

  const handleSelectUser = async (user: UserDto) => {
    setIsUserListOpen(false);
    try {
      // Check if a conversation already exists
      const response = await getDirectMessages({ userId: user.id, limit: 1 });
      if (response.data.length > 0) {
        toast.info(`${user.name}님과의 기존 대화방으로 이동합니다.`);
      } else {
        toast.info(`${user.name}님과의 새로운 대화를 시작합니다.`);
      }
      setSelectedUserId(user.id);
      // fetchChatRooms(); // No longer needed here, ConversationView will update
    } catch (err) {
      console.error('Failed to check existing DM:', err);
      toast.error('대화방 확인 중 오류가 발생했습니다.');
    }
  };

  const handleConversationUpdated = (updatedRoom: DirectMessageRoomDto) => {
    updateChatRoom(updatedRoom);
  };

  const handleNewConversationCreated = (newRoom: DirectMessageRoomDto) => {
    addChatRoom(newRoom);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] border-t isolate">
      {/* 왼쪽 패널: 대화방 목록 */}
      <aside className="relative z-30 w-full max-w-sm border-r shrink-0 overflow-y-auto bg-white">
        <div className="sticky top-0 z-10 bg-white p-4 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">메시지</h1>
          <button
            className="bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsUserListOpen(true)}
          >
            <Plus size={20} />
          </button>
        </div>
        <ChatRoomList onSelectUserFromList={setSelectedUserId} />
      </aside>

      {/* 오른쪽 패널: 선택된 대화 내용 */}
      <main className="relative z-0 flex-1 bg-gray-50">
        {selectedUserId ? (
          <ConversationView 
            userId={selectedUserId} 
            onConversationUpdated={handleConversationUpdated} 
            onNewConversationCreated={handleNewConversationCreated} 
          />
        ) : (
          <DmPlaceholder />
        )}
      </main>
      <UserListPopup
        isOpen={isUserListOpen}
        onClose={() => setIsUserListOpen(false)}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}