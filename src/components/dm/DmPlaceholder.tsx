import messageIcon from '@/assets/illust_logos/il_message.svg';

export function DmPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <img src={messageIcon} alt="메시지 아이콘" className="w-24 h-24 text-gray-300" />
      <h2 className="mt-4 text-2xl font-bold text-gray-700">대화를 시작해보세요</h2>
      <p className="mt-2 text-gray-500">왼쪽 목록에서 대화를 선택하여 메시지를 확인하세요.</p>
    </div>
  );
}
