import { Link } from 'react-router-dom';
import type { DirectMessageRoomDto } from '@/lib/api/chats';
import defaultProfileIcon from '@/assets/icons/profile.svg';

// 간단한 시간 포맷 유틸리티
const formatTimestamp = (iso?: string | null) => {
  if (!iso) return "";                           // null/undefined 가드
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";          // invalid date 가드

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "방금 전";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;

  // 하루 이상: 올해면 월/일, 아니면 연/월/일
  const opts: Intl.DateTimeFormatOptions =
    date.getFullYear() === now.getFullYear()
      ? { month: "long", day: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("ko-KR", opts);
};

interface ChatRoomItemProps {
  room: DirectMessageRoomDto;
}

export function ChatRoomItem({ room }: ChatRoomItemProps) {
  const { partner, lastMessage, lastMessageSentAt } = room;

  return (
    <Link
      to={`/dm/${partner.userId}`}
      className="flex items-center gap-4 p-4 transition-colors rounded-lg hover:bg-gray-100/80"
    >
      <div className="relative flex-shrink-0">
        <img
          src={partner.profileImageUrl || defaultProfileIcon}
          alt={partner.name}
          className="object-cover w-14 h-14 rounded-full border"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-bold truncate text-gray-800 text-lg">{partner.name}</p>
          {lastMessage && (
            <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTimestamp(lastMessageSentAt)}
            </p>
          )}
        </div>
        <div className="flex items-start justify-between mt-1">
          <p className="text-sm text-gray-600 truncate">
            {lastMessage || '아직 대화 내용이 없습니다.'}
          </p>
        </div>
      </div>
    </Link>
  );
}
