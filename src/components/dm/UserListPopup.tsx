import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/lib/stores/useUserStore';
import type { UserDto } from '@/lib/api/types';
import profileIcon from '@/assets/icons/profile.svg';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useDebouncedCallback } from 'use-debounce';

interface UserListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserDto) => void;
}

export function UserListPopup({ isOpen, onClose, onSelectUser }: UserListPopupProps) {
  const { data: users, fetch, fetchMore, updateParams, hasNext } = useUserStore();
  const { data: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => user.id !== currentUser?.userDto?.id);

  const debouncedSetSearchTerm = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 300);

  useEffect(() => {
    if (isOpen) {
      updateParams({ emailLike: searchTerm || undefined });
      fetch();
    }
  }, [isOpen, searchTerm, fetch, updateParams, currentUser?.userDto?.id]);

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    onLoadMore: () => {
      if (hasNext()) {
        fetchMore();
      }
    },
    rootMargin: '50px',
    threshold: 0.1
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새로운 대화 시작</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="사용자 검색..."
            value={searchTerm}
            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto" ref={infiniteScrollRef}>
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500">사용자를 찾을 수 없습니다.</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="bg-gray-200 relative rounded-full shrink-0 size-8">
                    <img 
                      src={profileIcon} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <p className="font-medium">{user.name} ({user.email})</p>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
