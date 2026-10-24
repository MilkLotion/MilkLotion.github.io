/**
 * 앱 문구 한 줄 — `백틱` 안은 앱 화면의 단추·탭 이름이라 칩으로
 * - 패치노트 원문(data/patch-notes.json)이 이 표기를 씀
 */
export const InlineText = ({ text }: { text: string }) => (
  <>
    {text.split(/(`[^`]+`)/).map((part, index) =>
      part.startsWith('`') && part.endsWith('`') ? (
        <span key={index} className="mx-0.5 inline-block rounded-full bg-accent px-2 text-[0.88em] leading-[1.7] font-semibold whitespace-nowrap">
          {part.slice(1, -1)}
        </span>
      ) : (
        part
      ),
    )}
  </>
);
