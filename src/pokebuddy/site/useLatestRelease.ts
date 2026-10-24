import { useEffect, useState } from 'react';

import { FALLBACK_RELEASE, fetchLatestRelease, type ReleaseInfo } from './release';

/**
 * GitHub 최신 릴리스 조회
 * - 처음엔 FALLBACK_RELEASE, 응답이 오면 교체
 * - 실패(요청 한도 초과·오프라인)면 FALLBACK 유지 — 버튼은 릴리스 페이지로 이어짐
 */
export const useLatestRelease = () => {
  const [release, setRelease] = useState<ReleaseInfo>(FALLBACK_RELEASE);

  useEffect(() => {
    const controller = new AbortController();

    fetchLatestRelease(controller.signal)
      .then(setRelease)
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return release;
};
