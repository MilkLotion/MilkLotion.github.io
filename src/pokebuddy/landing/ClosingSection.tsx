import { Button } from '../../shared/ui/button';
import { spriteUrl } from './content';

/** 스타터 예시 — 1세대 첫 포켓몬 3종 */
const STARTER_IDS = [1, 4, 7] as const;

/** 마무리 — 첫 포켓몬 고르기 안내 + 받기 버튼 */
export const ClosingSection = () => (
  <section className="px-4 pb-20 sm:px-6 md:pb-30">
    <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-5 rounded-3xl bg-brand-navy px-6 py-14 text-center md:py-16">
      <div className="flex gap-2">
        {STARTER_IDS.map((id) => (
          <img key={id} src={spriteUrl(id)} alt="" width={96} height={96} className="pixelated size-18" />
        ))}
      </div>
      <h2 className="text-[26px] font-extrabold text-white md:text-4xl">첫 포켓몬을 골라 보세요</h2>
      <p className="text-white/80">역대 스타터 27종과 피츄, 이브이 가운데 한 마리로 시작해요.</p>
      <Button asChild variant="onDark" size="lg">
        <a href="#download">다운로드</a>
      </Button>
    </div>
  </section>
);
