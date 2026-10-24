import { Check, ChevronDown, Copy, Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../shared/ui/dropdown-menu';
import { detectPlatform, PLATFORM_LABELS, type Platform, type ReleaseInfo } from '../site/release';

const PLATFORMS: Platform[] = ['windows', 'mac-arm64', 'mac-x64'];

interface DownloadButtonsProps {
  release: ReleaseInfo;
}

/**
 * 다운로드 버튼 묶음
 * - PC: 방문자 OS 버튼 + "다른 OS" 메뉴
 * - 모바일: PC 전용 앱이라 주소 복사 안내
 */
export const DownloadButtons = ({ release }: DownloadButtonsProps) => {
  const [platform] = useState(detectPlatform);

  if (platform === null) return <CopyLinkPanel />;

  const others = PLATFORMS.filter((item) => item !== platform);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button asChild variant="onDark" size="lg">
        <a href={release.downloads[platform]}>
          <Download aria-hidden="true" />
          {PLATFORM_LABELS[platform]} 버전 다운로드
        </a>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="onDarkOutline" size="lg">
            다른 OS
            <ChevronDown aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {others.map((item) => (
            <DropdownMenuItem key={item} asChild>
              <a href={release.downloads[item]}>
                <Download aria-hidden="true" />
                {PLATFORM_LABELS[item]}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const CopyLinkPanel = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-white/10 p-4 text-sm text-white">
      <p>PC 에서 쓰는 앱이에요. 주소를 복사해 두고 PC 에서 받아 보세요.</p>
      <Button variant="onDark" onClick={handleCopy}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? '복사했어요' : '주소 복사'}
      </Button>
    </div>
  );
};
