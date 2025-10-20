import { apiClient } from './client';
import type { CursorResponse } from './types';
import type { AuthorDto } from './chats'; // chats.ts에서 AuthorDto 재사용

export interface DirectMessageDto {
  id: string;
  sender: AuthorDto;
  receiver: AuthorDto;
  content: string;
  createdAt: string; // ISO 8601 date string
}

export interface DirectMessageListParams {
  userId: string;
  cursor?: string;
  idAfter?: string;
  limit?: number;
}

/**
 * 특정 사용자와의 DM 메시지 목록을 조회합니다.
 * @param params userId, cursor, idAfter, limit
 * @returns DirectMessageDto 목록을 포함하는 CursorResponse
 */
export const getDirectMessages = async (params: DirectMessageListParams): Promise<CursorResponse<DirectMessageDto>> => {
  return apiClient.get<CursorResponse<DirectMessageDto>>('/api/direct-messages', { params });
};