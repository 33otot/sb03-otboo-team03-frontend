import { useEffect } from 'react';
import { useChatStore } from '@/lib/stores/useChatStore';
import { ChatRoomItem } from './ChatRoomItem';

export function ChatRoomList() {
  const { chatRooms, loading, error, fetchChatRooms } = useChatStore();

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">대화 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">오류가 발생했습니다: {error.message}</div>;
  }

  if (chatRooms.length === 0) {
    return <div className="p-6 text-center text-gray-500">진행중인 대화가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {chatRooms.map((room) => (
        <ChatRoomItem key={room.partner.userId} room={room} />
      ))}
    </div>
  );
}
