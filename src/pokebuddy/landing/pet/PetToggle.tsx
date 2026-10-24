import { Eye, EyeOff } from 'lucide-react';

import { Button } from '../../../shared/ui/button';

interface PetToggleProps {
  shown: boolean;
  onToggle: () => void;
}

/** 화면 오른쪽 아래 고정 단추 — 포켓몬이 글을 가릴 때 치움 */
export const PetToggle = ({ shown, onToggle }: PetToggleProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onToggle}
    className="fixed right-4 bottom-4 z-50 shadow-md"
  >
    {shown ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
    {shown ? '포켓몬 숨기기' : '포켓몬 보이기'}
  </Button>
);
