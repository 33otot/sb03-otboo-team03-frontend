import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebSocketStore } from '@/lib/stores/websocketStore';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useDirectMessageStore } from '@/lib/stores/useDirectMessageStore';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { getProfile } from '@/lib/api/users';
import type { DirectMessageDto } from '@/lib/api/messages';
import type { ProfileDto } from '@/lib/api/types';
import defaultProfileIcon from '@/assets/icons/profile.svg';
import sendIcon from '@/assets/icons/ic_send.svg';

// DMModal에서 가져온 시간 포맷 유틸리티
const formatTimeAgo = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  return created.toLocaleDateString('ko-KR');
};

interface ConversationViewProps {
  userId: string;
}

export function ConversationView({ userId: targetUserId }: ConversationViewProps) {
  const [targetUser, setTargetUser] = useState<{ id: string; name: string; profileImageUrl?: string } | null>(null);

  const { send, isConnected, subscribe } = useWebSocketStore();
  const { data: auth } = useAuthStore();
  const { messages, add, updateParams, clearData: clearMessages, fetchMore, loading } = useDirectMessageStore();

  const [content, setContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { ref } = useInfiniteScroll({
    onLoadMore: () => fetchMore(),
    rootMargin: '10px',
    threshold: 1,
  });

  // User 정보 가져오기
  useEffect(() => {
    if (targetUserId) {
      getProfile({ userId: targetUserId }).then((profile: ProfileDto) => setTargetUser({ id: profile.userId, name: profile.name, profileImageUrl: profile.profileImageUrl })).catch(console.error);
      updateParams({ userId: targetUserId });
    } 
    // 컴포넌트 언마운트 시 메시지 데이터 정리
    return () => {
      clearMessages();
    }
  }, [targetUserId, updateParams, clearMessages]);

  // 웹소켓 구독
  useEffect(() => {
    if (!auth || !targetUser) return;
    const destination = resolveDestination(auth.userDto.id, targetUser.id);
    const unsubscribe = subscribe(destination, (message) => {
      add(message);
    });
    return unsubscribe; // 클린업 함수에서 구독 해제
  }, [subscribe, add, auth, targetUser]);

  // 메시지 목록 맨 아래로 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const resolveDestination = useCallback((senderId: string, receiverId: string) => {
    let dest = '/sub/direct-messages_';
    if (senderId.localeCompare(receiverId) < 0) {
      dest = dest.concat(senderId).concat('_').concat(receiverId);
    } else {
      dest = dest.concat(receiverId).concat('_').concat(senderId);
    }
    return dest;
  }, []);

  const sendMessage = useCallback(async () => {
    if (!isConnected || !auth || !targetUser || !content.trim()) return;
    const message = {
      senderId: auth.userDto.id,
      receiverId: targetUser.id,
      content: content.trim(),
    };
    send('/pub/direct-messages_send', message);
    setContent('');
  }, [isConnected, auth, targetUser, content, send]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!targetUser) {
    return <div className="p-6 text-center text-gray-500">사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* 헤더 */}
      <header className="flex gap-3 items-center px-5 py-3 border-b flex-shrink-0">
        <img
          src={targetUser.profileImageUrl || defaultProfileIcon}
          alt={targetUser.name}
          className="w-10 h-10 object-cover rounded-full border"
        />
        <h2 className="text-lg font-bold text-gray-800">{targetUser.name}</h2>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-5">
        {(loading && messages.length === 0) ? (
          <div className="flex items-center justify-center h-full">
            <p>메시지를 불러오는 중...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-4">
             <div ref={ref} className="w-full h-1"/>
            {messages.slice().sort((a: DirectMessageDto, b: DirectMessageDto) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg: DirectMessageDto) => (
              <div key={msg.id}>
                {msg.sender.userId === auth?.userDto.id ? (
                  <div className="flex gap-2 items-end justify-end">
                    <p className="text-xs text-gray-500">{formatTimeAgo(msg.createdAt)}</p>
                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs break-words">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-start">
                     <img src={targetUser.profileImageUrl || defaultProfileIcon} alt={targetUser.name} className="w-8 h-8 rounded-full"/>
                    <div className="flex items-end gap-2">
                      <div className="bg-gray-200 p-3 rounded-lg max-w-xs break-words">
                        {msg.content}
                      </div>
                      <p className="text-xs text-gray-500">{formatTimeAgo(msg.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 메시지 입력 영역 */}
      <div className="p-4 border-t bg-white">
        <div className="bg-gray-100 h-[54px] relative rounded-full w-full">
          <div className="flex items-center justify-between h-full pl-5 pr-3 py-3.5">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지 입력..."
              className="flex-1 bg-transparent border-none outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!content.trim()}
              className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={sendIcon} alt="메시지 보내기" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

