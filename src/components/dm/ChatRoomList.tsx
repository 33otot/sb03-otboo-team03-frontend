import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/lib/stores/useChatStore';
import { ChatRoomItem } from './ChatRoomItem';
import { useNavigate } from 'react-router-dom';

interface ChatRoomListProps {
  onSelectUserFromList?: (userId: string) => void;
}

const CHAT_ROOM_FETCH_LIMIT = 20;

export function ChatRoomList({ onSelectUserFromList }: ChatRoomListProps) {
  const {
    chatRooms,
    loading,
    error,
    hasNext,
    fetchChatRooms,
    fetchMoreChatRooms,
    reset,
  } = useChatStore();
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchChatRooms(CHAT_ROOM_FETCH_LIMIT);
    return () => {
      reset();
    };
  }, [fetchChatRooms, reset]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          fetchMoreChatRooms(CHAT_ROOM_FETCH_LIMIT);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasNext, fetchMoreChatRooms]
  );

  const handleChatRoomClick = (userId: string) => {
    if (onSelectUserFromList) {
      onSelectUserFromList(userId);
    } else {
      navigate(`/dm`);
    }
  };

  if (loading && chatRooms.length === 0) {
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
        <div ref={lastElementRef} style={{ height: '1px' }} />
      </div>
      {loading && <div className="p-4 text-center text-gray-500">불러오는 중...</div>}
    </div>
  );
}
