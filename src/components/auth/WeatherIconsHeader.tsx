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
