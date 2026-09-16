interface ScreenDotsProps {
  count: number;
  current: number;
}

/** 현재 화면 위치 — 지금 화면은 긴 타원 + 강조색, 나머지는 흰 원 */
export const ScreenDots = ({ count, current }: ScreenDotsProps) => (
  <ol className="screen-dots" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <li key={index} className="screen-dots__dot" data-current={index === current} />
    ))}
  </ol>
);
