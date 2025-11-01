import { apiClient } from './client';

// 백엔드 AuthorDto에 맞춰 정의
export interface AuthorDto {
  userId: string;
  name: string;
  profileImageUrl: string | null;
}

// 백엔드 DirectMessageRoomDto에 맞춰 정의
export interface DirectMessageRoomDto {
  partner: AuthorDto;
  lastMessage: string | null; // 마지막 메시지가 없을 수도 있음
  lastMessageSentAt: string | null; // 마지막 메시지 전송 시간이 없을 수도 있음
  // unreadCount는 백엔드 DTO에 없으므로 여기서는 제외
}

// 백엔드 DirectMessageRoomListResponse에 맞춰 정의
export interface DirectMessageRoomListResponse {
  rooms: DirectMessageRoomDto[];
  nextCursor: string | null;
  nextIdAfter: string | null;
  hasNext: boolean;
  totalCount: number;
  sortBy: string;
  sortDirection: string;
}

export interface GetChatRoomsParams {
  cursor?: string;
  idAfter?: string;
  limit: number;
}

/**
 * 현재 사용자의 모든 대화방 목록을 가져옵니다.
 * @returns DirectMessageRoomListResponse의 Promise
 */
export const getChatRooms = async (params: GetChatRoomsParams): Promise<DirectMessageRoomListResponse> => {
  return apiClient.get<DirectMessageRoomListResponse>('/api/direct-messages/rooms', { params });
};