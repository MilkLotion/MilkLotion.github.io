import { ArrowUp } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { Button } from '../../shared/ui/button';

/** 이만큼 내려오면 단추가 보임 (px) */
const SHOW_AFTER_PX = 600;

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};

const isScrolled = () => window.scrollY > SHOW_AFTER_PX;

/** 맨 위로 — 오른쪽 아래 떠 있는 단추. 첫 화면에서는 숨김 */
export const ScrollTopButton = () => {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, () => false);
  if (!scrolled) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="맨 위로"
      title="맨 위로"
      onClick={() => window.scrollTo({ top: 0 })}
      className="shadow-md"
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  );
};
