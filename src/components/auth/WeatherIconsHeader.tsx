import LoginUpperSectionSvg from "@/assets/illust_logos/login upper section.svg";

export default function WeatherIconsHeader() {
  return (
    <div className="flex items-center justify-center mb-[-40px] relative z-[2]">
      <img
        src={LoginUpperSectionSvg}
        alt=""
        role="presentation"
        className="
          block w-full max-w-[720px] object-contain relative z-20
          -translate-y-2 md:-translate-y-6  /* ▲ 살짝 위로 */
          pointer-events-none select-none
        "
      />
       <div className="absolute inset-x-0 bottom-[2px] h-8 md:h-6 bg-white z-10 pointer-events-none" />
    </div>
  );
}


// export default function WeatherIconsHeader() {
//   return (
//     <div className="relative z-[2] mb-[-40px] flex items-center justify-center">
//       {/* 둥근 카드 상단 래퍼: 여기서만 클리핑 */}
//       <div className="relative w-full max-w-[720px] rounded-t-[36px] bg-white overflow-hidden">
//         {/* 눈 이미지 영역(고정 높이) */}
//         <div className="relative h-[150px] sm:h-[170px]">
//           <img
//             src={LoginUpperSectionSvg}
//             alt=""
//             role="presentation"
//             className="
//               absolute left-1/2 -translate-x-1/2
//               bottom-[-8px]                 /* 살짝 내려서 경계 가림 */
//               w-[calc(100%+64px)]           /* 좌우 32px씩 더 넓게 */
//               max-w-none object-cover object-top
//               pointer-events-none select-none
//             "
//           />
//         </div>

//         {/* 경계 가리개(라운드 유지) */}
//         <div className="absolute inset-x-0 bottom-[-1px] h-14 bg-white rounded-t-[36px] pointer-events-none" />
//         {/* 1px 보정 라인 */}
//         <div className="absolute inset-x-0 bottom-0 h-px bg-white pointer-events-none" />
//       </div>
//     </div>
//   );
// }

