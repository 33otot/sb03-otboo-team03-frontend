import { useEffect, useState } from 'react';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import FeedCard from '@/components/feeds/FeedCard';
import FeedCardSkeleton from '@/components/feeds/FeedCardSkeleton';
import FeedDetailModal from '@/components/feeds/FeedDetailModal';
import type { FeedDto } from '@/lib/api/types';
import { useDeletedFeedStore } from '@/lib/stores/useDeletedFeedStore';
import { restoreFeed } from '@/lib/api/feeds';
import { toast } from 'sonner';

interface DeletedFeedListProps {
  userId: string;
}

export default function DeletedFeedList({ userId }: DeletedFeedListProps) {
  const { data: feeds, loading, fetch, fetchMore, delete: deleteFeedFromStore } = useDeletedFeedStore();
  const [selectedFeed, setSelectedFeed] = useState<FeedDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFeedClick = (feed: FeedDto) => {
    setSelectedFeed(feed);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedFeed(null), 300); // 애니메이션 완료 후 상태 정리
  };

  const handleRestoreClick = async (feedId: string) => {
    try {
      await restoreFeed(feedId);
      deleteFeedFromStore(feedId);
      handleModalClose();
      toast.success('피드가 성공적으로 복구되었습니다.');
    } catch (error) {
      console.error('피드 복구 실패:', error);
      const message = error instanceof Error ? error.message : '피드 복구에 실패했습니다.';
      toast.error(message);
    }
  };

  // 무한 스크롤 설정
  const { ref } = useInfiniteScroll({
    onLoadMore: () => fetchMore()
  });

  // 삭제된 피드 데이터 로드
  useEffect(() => {
    if (userId) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="h-full overflow-y-auto">
      {loading && feeds.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <FeedCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : feeds.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500 text-center">
            <p className="text-lg">아직 삭제된 피드가 없습니다.</p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {feeds.map((feed) => (
              <FeedCard 
                key={feed.id} 
                feed={feed} 
                onClick={() => handleFeedClick(feed)}
              />
            ))}

            {/* 무한 스크롤 로딩 중인 경우 하단에 스켈레톤 추가 */}
            {loading && feeds.length > 0 && 
              Array.from({ length: 3 }).map((_, index) => (
                <FeedCardSkeleton key={`loading-skeleton-${index}`} />
              ))
            }
          </div>

          {/* 무한 스크롤 트리거 영역 */}
          <div ref={ref} className="w-full h-1 mt-8" />
        </div>
      )}

      {/* 피드 상세 모달 */}
      <FeedDetailModal 
        feed={selectedFeed}
        open={modalOpen}
        onOpenChange={handleModalClose}
        isDeletedFeed={true}
        onRestoreClick={handleRestoreClick}
      />
    </div>
  );
}