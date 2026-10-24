import { Eye, EyeOff } from 'lucide-react';

import { Button } from '../../../shared/ui/button';

interface PetToggleProps {
  shown: boolean;
  onToggle: () => void;
}

/** 포켓몬 숨기기·보이기 — 오른쪽 아래 떠 있는 단추 묶음(LandingPage)에 놓임. 포켓몬이 글을 가릴 때 치움 */
export const PetToggle = ({ shown, onToggle }: PetToggleProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onToggle}
    className="shadow-md"
  >
    {shown ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
    {shown ? '포켓몬 숨기기' : '포켓몬 보이기'}
  </Button>
);
