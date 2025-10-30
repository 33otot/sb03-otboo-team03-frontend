import { useEffect } from 'react';
import { useChatStore } from '@/lib/stores/useChatStore';
import { ChatRoomItem } from './ChatRoomItem';
import { useNavigate } from 'react-router-dom'; // Keep navigate for ChatRoomItem click

interface ChatRoomListProps {
  onSelectUserFromList?: (userId: string) => void;
}

export function ChatRoomList({ onSelectUserFromList }: ChatRoomListProps) {
  const { chatRooms, loading, error, fetchChatRooms } = useChatStore();
  const navigate = useNavigate(); // Keep navigate for ChatRoomItem click

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  const handleChatRoomClick = (userId: string) => {
    if (onSelectUserFromList) {
      onSelectUserFromList(userId);
    } else {
      navigate(`/dm/${userId}`); // Fallback to navigation if not in DmPage context
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">대화 목록을 불러오는 중...</div>;
  }

  if (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return <div className="p-6 text-center text-red-500">오류가 발생했습니다: {msg}</div>;
  }

  if (chatRooms.length === 0) {
    return <div className="p-6 text-center text-gray-500">진행중인 대화가 없습니다.</div>;
  }

  return (
    <div className="relative h-full">
      <div className="flex flex-col divide-y divide-gray-200">
        {chatRooms.map((room) => (
          <ChatRoomItem 
            key={room.partner.userId} 
            room={room} 
            onClick={() => handleChatRoomClick(room.partner.userId)} 
          />
        ))}
      </div>
    </div>
  );
}
