import { Outlet } from 'react-router-dom';
import { ChatRoomList } from '@/components/dm/ChatRoomList';

export default function DmPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] border-t isolate">
      {/* 왼쪽 패널: 대화방 목록 */}
      <aside className="relative z-30 w-full max-w-sm border-r shrink-0 overflow-y-auto bg-white">
        <div className="sticky top-0 z-10 bg-white p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">메시지</h1>
        </div>
        <ChatRoomList />
      </aside>

      {/* 오른쪽 패널: 선택된 대화 내용 */}
      <main className="relative z-0 flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}