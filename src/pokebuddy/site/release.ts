/** pokebuddy 릴리스 정보 — GitHub 최신 릴리스 기준 다운로드 주소 계산 */

export const REPO_URL = 'https://github.com/MilkLotion/pokebuddy';
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
const LATEST_API = 'https://api.github.com/repos/MilkLotion/pokebuddy/releases/latest';

export type Platform = 'windows' | 'mac-arm64' | 'mac-x64';

export interface ReleaseInfo {
  version: string;
  /** YYYY-MM-DD */
  date: string;
  /** 플랫폼별 설치 파일 주소. 못 찾으면 릴리스 페이지 */
  downloads: Record<Platform, string>;
}

/**
 * 받기 전·실패 시 보여줄 값
 * - 마지막 확인: v0.22.2 (2026-10-25)
 * - 주소는 릴리스 페이지 — 파일 이름은 버전마다 바뀌어 직접 링크를 고정하지 않음
 */
export const FALLBACK_RELEASE: ReleaseInfo = {
  version: '0.22.2',
  date: '2026-10-25',
  downloads: { windows: RELEASES_URL, 'mac-arm64': RELEASES_URL, 'mac-x64': RELEASES_URL },
};

/** 릴리스 파일 이름 규칙 — Windows `pokebuddy-Setup-<v>.exe` · Mac `PokeBuddy-<v>-arm64.dmg` / `-x64.dmg` */
const ASSET_PATTERNS: Record<Platform, RegExp> = {
  windows: /setup.*\.exe$/i,
  'mac-arm64': /arm64\.dmg$/i,
  'mac-x64': /x64\.dmg$/i,
};

interface GithubRelease {
  tag_name: string;
  published_at: string;
  assets: { name: string; browser_download_url: string }[];
}

const findAsset = (release: GithubRelease, platform: Platform) =>
  release.assets.find((asset) => ASSET_PATTERNS[platform].test(asset.name))?.browser_download_url ?? RELEASES_URL;

export const fetchLatestRelease = async (signal: AbortSignal): Promise<ReleaseInfo> => {
  const response = await fetch(LATEST_API, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`릴리스 조회 실패: ${response.status}`);

  const release = (await response.json()) as GithubRelease;

  return {
    version: release.tag_name.replace(/^v/, ''),
    // 한국 날짜 — UTC 그대로 자르면 오전 9시 전 릴리스가 하루 앞 날짜로 나옴 (패치노트 날짜와 어긋남)
    date: new Date(release.published_at).toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }),
    downloads: {
      windows: findAsset(release, 'windows'),
      'mac-arm64': findAsset(release, 'mac-arm64'),
      'mac-x64': findAsset(release, 'mac-x64'),
    },
  };
};

/**
 * 방문자 OS 추정
 * - Mac 칩 종류는 브라우저가 알려주지 않음 → Apple Silicon 으로 가정, 다른 OS 메뉴에서 Intel 선택
 * - 모바일·기타는 null (PC 전용 앱)
 */
export const detectPlatform = (): Platform | null => {
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return null;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'mac-arm64';
  return null;
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  windows: 'Windows',
  'mac-arm64': 'Mac (Apple 실리콘)',
  'mac-x64': 'Mac (Intel)',
};
