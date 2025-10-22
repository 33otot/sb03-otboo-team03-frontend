import React, { useEffect, useRef, useCallback } from 'react';
import { useNotificationStore } from '@/lib/stores/useNotificationStore.ts';
import { readNotification } from '@/lib/api/notifications.ts';
import { NotificationItem } from './NotificationItem.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';

interface NotificationListProps {
  isOpen: boolean;
  onClose: () => void;
  anchorElement?: HTMLElement | null;
}

export const NotificationList = ({ isOpen, onClose, anchorElement }: NotificationListProps) => {
  const {
    data: notifications,
    loading,
    fetchMore,
    delete: removeNotification,
    deleteAll
  } = useNotificationStore();

  const listRef = useRef<HTMLDivElement>(null); // popup 전체 (외부 클릭용)
  const scrollContainerRef = useRef<HTMLDivElement>(null); // 내부 스크롤 컨테이너

  // 스크롤 핸들러: 스크롤 컨테이너가 바닥에 가까워지면 불러오기
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const thresholdPx = 150; // 바닥으로부터 얼마나 남았을 때 불러올지 (픽셀)
      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

      if (distanceToBottom <= thresholdPx) {
        if (loading) return; // 로딩 중이면 중복 호출 방지
        fetchMore();
      }
    },
    [fetchMore, loading]
  );

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        listRef.current &&
        !listRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorElement]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 알림 클릭 핸들러
  const handleNotificationClick = async (notificationId: string) => {
    try {
      // API 호출이 성공했을 때만 클라이언트 상태 변경
      await readNotification(notificationId);
      removeNotification(notificationId);
      toast.info('알림을 읽음 처리했습니다.');
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      toast.error('알림 읽음 처리에 실패했습니다.');
    }
  };

  // 새로 추가한 함수
  const handleDeleteAll = async () => {
    try {
      await deleteAll();
      toast.success('모든 알림이 삭제되었습니다.');
      onClose(); // 삭제 후 창 닫기
    } catch (error) {
      console.error('Failed to delete all notifications', error);
      toast.error('알림 삭제 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  // 포지셔닝 계산
  const getPopupStyle = (): React.CSSProperties => {
    if (!anchorElement) return {};
    
    const rect = anchorElement.getBoundingClientRect();
    const popupWidth = 450; // 팝업 너비
    const popupHeight = 530; // 고정 높이 (헤더 50px + 알림목록 480px)
    
    return {
      position: 'fixed' as const,
      top: rect.bottom + 8, // 버튼 아래 8px
      right: window.innerWidth - rect.right, // 오른쪽 정렬
      width: popupWidth,
      height: popupHeight,
      zIndex: 1000,
    };
  };

  return (
    <div 
      ref={listRef}
      className="bg-white rounded-[20px] border border-[var(--color-gray-200)] shadow-[0px_2px_10px_0px_rgba(41,52,57,0.14)] overflow-hidden"
      style={getPopupStyle()}
    >
      {/* 알림 헤더 */}
      <div className="flex justify-between items-center p-4 border-b h-[50px]">
        <h1 className="font-semibold text-lg">알림</h1>
        {notifications.length > 0 && (
            <Button
              variant="link"
              className="text-sm text-[var(--color-gray-400)] p-0 h-auto"
              onClick={handleDeleteAll}
            >
              모두 지우기
            </Button>
        )}
      </div>

      {/* 알림 목록 (스크롤 컨테이너에 onScroll 연결) */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex flex-col gap-0.5 h-[480px] overflow-y-auto"
      >
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--color-gray-400)]">
            알림이 없습니다
          </div>
        ) : (
          <>
            {notifications.map((notification) => {
              return (
                <div key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                </div>
              );
            })}

            {loading && notifications.length > 0 && (
              <div className="p-4 text-center text-[var(--color-gray-400)] text-sm">
                더 불러오는 중...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};