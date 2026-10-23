import type { ArtifactKind, DemoScenario } from './types';

export const DEMO_SCENARIOS: Record<ArtifactKind, DemoScenario> = {
  apps: {
    title: '두 창에서 토큰이 동시에 만료된 경우', actors: ['창 A', '창 B'],
    steps: [
      { label: '만료 감지', left: '갱신 필요', right: '갱신 필요', event: '401', description: '두 창에서 만료를 감지했습니다.' },
      { label: '잠금 획득', left: '잠금 획득', right: '순서 대기', event: 'LOCK', description: 'A가 잠금을 얻습니다. B는 잠금이 풀릴 때까지 기다립니다.' },
      { label: '결과 전달', left: '토큰 갱신', right: '결과 수신', event: 'CHANNEL', description: 'A는 갱신 결과를 채널로 전달합니다. 잠금만으로는 다른 창에 결과가 전달되지 않습니다.' },
      { label: '상태 재확인', left: '갱신 완료', right: '새 토큰 확인', event: 'CHECK', description: 'B는 잠금을 얻은 뒤 상태를 다시 확인합니다. 이미 갱신됐다면 같은 요청을 반복하지 않습니다.' },
    ],
  },
  components: {
    title: '서브패스가 누락된 패키지 검사', actors: ['일반 빌드', '배포본 검사'],
    steps: [
      { label: '빌드', left: '통과', right: '검사 전', event: 'BUILD', description: '코드 빌드는 통과했지만 설치된 패키지의 경로는 아직 확인하지 않았습니다.' },
      { label: '경로 검사', left: '통과', right: '경로 누락', event: 'EXPORTS', description: '배포 파일과 공개 경로를 대조해 사용할 수 없는 서브패스를 찾습니다.' },
      { label: '수정', left: '다시 빌드', right: '재검사', event: 'FIX', description: '경로를 수정하고 패키지를 다시 생성합니다.' },
      { label: '확인', left: '통과', right: '경로 확인', event: 'PASS', description: '수정한 소스뿐 아니라 새로 생성된 배포 파일까지 확인합니다.' },
    ],
  },
  calls: {
    title: 'A 응답을 늦게 도착시키기', actors: ['조회 응답', '현재 상담 폼'],
    steps: [
      { label: 'A 조회', left: 'A 조회 중', right: '통화 A', event: 'WAIT', description: '통화 A의 정보를 조회합니다.' },
      { label: 'B 수신', left: 'A 조회 중', right: '통화 B', event: 'NEW CALL', description: '조회가 끝나기 전에 B 전화를 받습니다.' },
      { label: 'A 도착', left: 'A 응답 도착', right: '통화 B', event: 'A ≠ B', description: '응답의 통화 ID A와 현재 통화 ID B가 다릅니다.' },
      { label: 'A 폐기', left: 'A 응답 폐기', right: 'B 정보 유지', event: 'DISCARD', description: 'A의 조회 결과를 버립니다. B의 상담 폼은 그대로 남습니다.' },
    ],
  },
  document: {
    title: '답변에서 원문으로 이동', actors: ['답변', '문서 패널'],
    steps: [
      { label: '답변', left: '질문·답변', right: '닫힘', event: 'ANSWER', description: '답변에 연결된 두 출처 중 하나를 고릅니다.' },
      { label: '출처 선택', left: '출처 2 선택', right: '문서 열림', event: 'SOURCE 2', description: '출처 2에 해당하는 문서를 옆 패널에서 엽니다.' },
      { label: '구절 확인', left: '답변 유지', right: '구절 강조', event: 'HIGHLIGHT', description: '해당 페이지와 구절로 이동합니다. 질문과 답변은 유지됩니다.' },
      { label: '출처 변경', left: '출처 1 선택', right: '다른 구절', event: 'SOURCE 1', description: '다른 출처를 골라 원문을 비교합니다.' },
    ],
  },
};
