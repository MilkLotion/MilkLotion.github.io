/**
 * 프로젝트 목록·상세 데이터
 * - 원천: 포트폴리오 카드 원고 + 케이스스터디 — 수치는 각 저장소 git log 실측 기준
 * - 공개 페이지 등급: 고객사는 기호형(A 은행 · B 공공기관), 소속사·자사 제품명은 실명
 * - 순서 = 키캡 숫자열 순서 (1 … 0, -) = 목록 순서 — 분류(회사 → 공모전 → 이전 경력)가 이어지게 배치
 * - 숫자열 마지막 `=` 키는 비워 둠
 */

export type ProjectGroupId = 'company' | 'contest' | 'career';

export interface ProjectGroup {
  label: string;
  /** 분류 dot 색 */
  color: string;
}

export const PROJECT_GROUPS: Readonly<Record<ProjectGroupId, ProjectGroup>> = {
  company: { label: '회사', color: '#233a94' },
  contest: { label: '공모전', color: '#c9ab6b' },
  career: { label: '이전 경력', color: '#9fa1a4' },
};

export const PROJECT_GROUP_ORDER: readonly ProjectGroupId[] = ['company', 'contest', 'career'];

export interface ProjectDecision {
  title: string;
  body: string;
}

export interface ProjectFact {
  label: string;
  value: string;
}

export interface ProjectMedia {
  /** public/ 기준 경로 */
  src: string;
  alt: string;
  caption: string;
}

export interface Project {
  slug: string;
  /** 이 프로젝트를 고르는 키캡 — KeyboardEvent.code */
  keyCode: string;
  /** 키캡 각인과 같은 표시용 글자 */
  keyLabel: string;
  group: ProjectGroupId;
  title: string;
  org: string;
  period: string;
  status: string;
  role: string;
  /** 한 줄 요약 — 숫자 없이 무엇을 왜 했나 */
  summary: string;
  /** 목록 패널에 보일 대표 수치 1~2개 */
  highlights: readonly string[];
  stack: readonly string[];
  context: readonly string[];
  decisions: readonly ProjectDecision[];
  facts: readonly ProjectFact[];
  media: readonly ProjectMedia[];
  /** 수치 기준 — 없으면 표시 안 함 */
  measuredNote: string | null;
}

const GIT_SNAPSHOT_NOTE = '수치는 2026년 9월 4일 git log 기준입니다. 진행 중인 프로젝트는 지금과 차이가 있습니다.';

export const PROJECTS: readonly Project[] = [
  {
    slug: 'sooni',
    keyCode: 'Digit1',
    keyLabel: '1',
    group: 'company',
    title: 'AICC 상담 데스크 (SOONi)',
    org: '퀀텀에이아이',
    period: '2026.05 ~ 현재',
    status: '4앱 사내 dev 운영',
    role: '프론트엔드 단독 — 모노레포 경계 설계 · 4앱 구축 · 실시간 음성 · 배포 구성',
    summary: '관리자·상담사·데모·채팅 위젯을 분리하고, 여러 창에서 함께 쓰는 세션을 조율했습니다.',
    highlights: ['커밋 1,443 / 1,453 (99.3%)', '4앱 × 7패키지 · 라우트 127'],
    stack: ['React 19', 'TypeScript', 'Turborepo', 'TanStack Router', 'Zustand', 'WebSocket'],
    context: [
      '사용자가 넷으로 갈립니다 — 관리자, 영업·QA 데모, 상담사, 고객 채팅 위젯. 같은 도메인 데이터를 쓰지만 권한·레이아웃·배포 경로가 전부 달라서, 어디서 쪼개느냐로 시작했습니다.',
      '상담사는 챗봇 빌더 같은 독립 창을 늘 둘 이상 띄웁니다. 세션 설계는 여기서 출발했습니다.',
    ],
    decisions: [
      {
        title: '단일 앱을 4단계로 나눠 옮기기',
        body: '화면 이관과 경계 확정을 한 번에 하면 되돌릴 지점이 없습니다. 기존 앱을 두고 새 구조를 옆에 세운 뒤, 단계마다 되돌릴 수 있는 크기로 옮겼습니다. 공유 계층 @shell 을 프레임과 세션만 맡게 좁힌 것이 분기점이었고, 마지막에 권한 가드를 라우트 단위로 모아 50여 페이지의 중복 분기를 없앴습니다.',
      },
      {
        title: '창 사이 세션 조율 — BroadcastChannel + navigator.locks',
        body: '토큰을 메모리에만 두면서 창 여러 개를 맞춰야 했습니다. 새 창은 서버에 가기 전에 다른 창에 토큰을 요청하고, 150ms 안에 답이 없을 때만 스스로 갱신합니다. 잠금은 순서만 정하고 결과 전달은 채널이 맡습니다 — 둘 중 하나만 있으면 갱신 요청이 겹칩니다.',
      },
      {
        title: '뒤늦게 들어온 회사 축 — 프론트와 백엔드를 같이 고치기',
        body: '회사라는 축이 데이터 모델부터 화면까지 없었습니다. 프론트만 고치면 서버가 다른 회사 데이터를 그대로 내려주므로, 화면 배선과 함께 백엔드 조회 경로를 직접 고쳤습니다(백엔드 저장소 108커밋).',
      },
    ],
    facts: [
      { label: '기여', value: '커밋 1,443 / 1,453 (99.3%)' },
      { label: '구조', value: '4앱 × 7패키지 · 라우트 127 · 소스 1,617파일' },
      { label: '정리 이력', value: 'refactor 커밋 18.4% · 앱 로컬 컴포넌트 238개 전수조사' },
      { label: '범위 확장', value: '백엔드 저장소 108커밋' },
    ],
    media: [
      {
        src: '/projects/sooni-monorepo-boundary.svg',
        alt: '단일 앱에서 관리자·데모·상담사·채팅 위젯 네 앱과 공유 패키지 일곱 개로 나눈 구조도',
        caption: '단일 앱 → 4앱 7패키지',
      },
      {
        src: '/projects/sooni-admin-monitoring.png',
        alt: '관리자 앱의 상담 모니터링 화면 — 상담사별 진행 상태 카드와 통화 지표',
        caption: '관리자 앱 · 상담 모니터링 (데모 데이터)',
      },
    ],
    measuredNote: GIT_SNAPSHOT_NOTE,
  },
  {
    slug: 'qds',
    keyCode: 'Digit2',
    keyLabel: '2',
    group: 'company',
    title: 'Quantum Design System',
    org: '퀀텀에이아이',
    period: '2025.12 ~ 현재',
    status: '진행 중',
    role: '단독 설계 · 개발 · CLI · 배포',
    summary: '폐쇄망에서 설치할 공통 UI를 개발했습니다. 개발 서버에서 보이지 않던 경로·스타일 누락을 배포 과정에서 검사하도록 보강했습니다.',
    highlights: ['커밋 684 / 713 (95.9%)', '컴포넌트 98종 · 소비처 3곳'],
    stack: ['React 19', 'TypeScript', 'Radix UI', 'Tailwind v4', 'CVA', 'Node CLI'],
    context: [
      '소비처가 폐쇄망입니다. 사내 레지스트리 밖의 npm 조회가 막혀 있고, 소비처마다 Tailwind 설정과 패키지명 규약이 다릅니다. 라이브러리가 통제할 수 없는 것들이라, 설계를 통제권 안쪽으로만 잡았습니다.',
      '개인적으로 개발하던 라이브러리를 신규 프로젝트의 공통 UI로 사용했습니다. 소비처 3곳 모두 제가 개발에 참여한 프로젝트입니다.',
    ],
    decisions: [
      {
        title: '빌드 파이프라인의 CSS 파서를 직접 작성',
        body: '유틸리티 레이어를 통째로 걷어냈다가 브랜드 색 유틸리티까지 빠져 소비처 화면이 깨진 적이 있습니다. 정규식은 여러 줄·중첩 선택자에서 불안정하고 PostCSS 는 폐쇄망 빌드에 부담이라, 중괄호 깊이와 문자열을 추적하는 파서를 직접 썼습니다.',
      },
      {
        title: '코드 주입과 패키지 배포를 옵션 하나로',
        body: '소스만 복사해 주면 버전 추적이 안 되고 의존 컴포넌트가 빠지면 런타임에 깨집니다. import 그래프를 정적 분석해 레지스트리를 자동 생성하고, tgz 패키지도 함께 유지해 CLI 옵션 하나로 두 방식을 같이 굴립니다.',
      },
      {
        title: '통과하는 빌드 뒤에 남는 회귀를 검증 스크립트로',
        body: '서브패스 9개가 누락되거나 포커스 표식이 빠진 릴리스도 빌드·린트·타입 검사는 통과했습니다. 패키징 명령에 검증 스크립트 4종을 연결했습니다. 3종은 회귀 대응, 1종은 폼 상태 색상을 통일한 결과를 유지하는 검사입니다.',
      },
    ],
    facts: [
      { label: '기여', value: '커밋 684 / 713 (95.9%)' },
      { label: '컴포넌트', value: '9카테고리 98종' },
      { label: '배포', value: '소비처별 변형 빌드 5종 · 릴리스 태그 54개' },
      { label: '품질 게이트', value: '릴리스 검증 스크립트 4종' },
    ],
    media: [
      {
        src: '/projects/qds-no-coercion.svg',
        alt: '소비처에 강요하지 않은 네 가지(네트워크 환경·Tailwind 설정·상태관리·패키지명)와 대신 한 방법을 정리한 표',
        caption: '소비처의 설치 환경별 대응',
      },
      {
        src: '/projects/qds-data-grid.png',
        alt: '디자인시스템 플레이그라운드의 DataGrid 컴포넌트 예시 화면',
        caption: '플레이그라운드 · DataGrid',
      },
    ],
    measuredNote: GIT_SNAPSHOT_NOTE,
  },
  {
    slug: 'public-agency-desk',
    keyCode: 'Digit3',
    keyLabel: '3',
    group: 'company',
    title: 'B 공공기관 AICC 구축',
    org: '퀀텀에이아이',
    period: '2026.01 ~ 2026.06',
    status: '개발 종료 · 오픈 전',
    role: '11인 SI — 모노레포 골격 설계 · 상담사 웹(싱글뷰 · CTI) 주담당',
    summary: '비동기 조회가 끝날 때 현재 통화 ID를 확인해 이전 응답을 폐기했습니다. 전화 상태와 동작의 조합도 타입으로 정의했습니다.',
    highlights: ['커밋 641 / 2,356 (11인 중 2위)', '전화 상태 8 × 동작 10 = 80조합'],
    stack: ['React 19', 'TypeScript', 'Turborepo', 'TanStack Router', 'Zustand', 'WebSocket'],
    context: [
      '자사 상담 제품을 고객사 요건에 맞춰 납품하는 SI 입니다. 고객사 특화를 앱 코드의 조건문으로 처리하면 다음 고객사에서 같은 일을 반복하게 됩니다.',
      '상담사 한 명이 통화·채팅·싱글뷰·지식검색을 동시에 띄우고, 전화 상태가 수시로 바뀝니다.',
    ],
    decisions: [
      {
        title: 'CTI 상태 매트릭스를 타입으로 열거',
        body: '전화 상태 8개 × 동작 10개 = 80가지 조합을 Record 타입으로 전부 적었습니다. 조건문으로 짜면 빠진 조합이 있는지 알 수 없지만, 타입으로 강제하면 컴파일러가 찾아줍니다.',
      },
      {
        title: '싱글뷰 위젯의 props 30개 → 0개',
        body: '위젯이 늘수록 부모가 넘기는 props 가 불어나, 화면 하나를 고치려면 위 계층을 전부 따라가야 했습니다. 관심사를 갈라 위젯 안쪽 Context 로 내렸고(CustomerInfo 30 → 0), 같은 패턴을 규칙으로 적어 다음 프로젝트의 기본값으로 넘겼습니다.',
      },
      {
        title: '통화 사전매핑 경쟁 상태 막기',
        body: '받기 버튼을 누르면 상담 폼이 채워져야 하는데, 5단계 비동기 시퀀스 도중 새 전화가 오면 이전 결과가 새 통화에 덮였습니다. 클라이언트 전용 상태로 시점을 명시하고, 매 await 뒤마다 아직 같은 통화인지 확인하게 했습니다.',
      },
    ],
    facts: [
      { label: '기여', value: '커밋 641 / 2,356 (11인 중 2위)' },
      { label: '담당 앱', value: '상담사 웹 368 / 961 (6인 중 1위)' },
      { label: '상태 모델링', value: '전화 상태 8 × 동작 10 = 80조합' },
      { label: '외부 검증', value: '모의해킹 지적 사항 반영 완료' },
    ],
    media: [
      {
        src: '/projects/agency-cti-state-matrix.svg',
        alt: '전화 상태 8개와 동작 10개의 80가지 조합을 타입으로 열거한 매트릭스 구조도',
        caption: 'CTI 상태 × 동작 매트릭스',
      },
    ],
    measuredNote: GIT_SNAPSHOT_NOTE,
  },
  {
    slug: 'bank-data-platform',
    keyCode: 'Digit4',
    keyLabel: '4',
    group: 'company',
    title: 'A 은행 데이터 플랫폼',
    org: '퀀텀에이아이',
    period: '2025.06 ~ 2025.12',
    status: '종료',
    role: '10인 SI — 중반 합류 후 프론트엔드 단독 · 2025.09부터 현장 파견',
    summary: '답변의 출처를 누르면 옆 문서 패널에서 해당 구절이 열리도록 연결했습니다. PDF 뷰어와 검색 기능은 패키지로 분리해 재사용했습니다.',
    highlights: ['커밋 285 / 1,562 (사내 저장소 기준)', 'PDF 라이브러리 → 후속 프로젝트로 이식'],
    stack: ['React', 'JavaScript', 'Ant Design', 'Zustand', 'TanStack Query', 'pdf.js'],
    context: [
      '폐쇄망입니다. 외부 CDN 을 쓸 수 없고, 빌드를 패키징해 반입하는 방식으로 배포합니다. 사내 정적 분석과 코드 리뷰를 통과해야 합니다.',
      '중반에 합류해 스택이 정해진 상태였습니다. 고른 것이 아니라 이어받은 조건입니다.',
    ],
    decisions: [
      {
        title: 'PDF 읽기·검색을 단독 패키지로',
        body: '서비스 코드가 pdf.js 를 직접 부르면 다른 프로젝트에서 다시 쓸 수 없습니다. 뷰어·검색·하이라이트 세 책임을 패키지로 떼어냈고, 실제로 후속 공공기관 프로젝트와 디자인시스템으로 옮겨졌습니다.',
      },
      {
        title: '응답 출처를 바로 확인하는 UX',
        body: 'RAG 응답이 어디서 왔는지 모호하면 믿고 쓰기 어렵습니다. 인라인 출처 칩을 누르면 오른쪽 패널에서 원문이 열리고 해당 페이지·구절이 하이라이트되도록 한 흐름으로 묶었습니다.',
      },
      {
        title: '미리보기 메모리 누수와 대용량 PDF',
        body: '미리보기를 여러 개 열면 워커가 쌓여 결국 멈췄습니다. 워커를 전역 풀로 모아 참조가 0일 때만 종료하게 했고, 100페이지가 넘는 문서는 가상 스크롤로 화면 근처 5~7페이지만 DOM 에 남겼습니다.',
      },
    ],
    facts: [
      { label: '기여', value: '커밋 285 / 1,562 (사내 저장소 기준 · 파견 기간 제외)' },
      { label: '재사용', value: 'PDF 라이브러리를 후속 프로젝트 · 디자인시스템으로 이식' },
      { label: '현장 대응', value: '요구사항·결함 조치, 보안 점검 대응, 테스트·오픈 지원' },
    ],
    media: [],
    measuredNote: null,
  },
  {
    slug: 'intro-sites',
    keyCode: 'Digit5',
    keyLabel: '5',
    group: 'company',
    title: '소개·데모 사이트',
    org: '퀀텀에이아이',
    period: '2026.05 ~ 2026.08',
    status: '종료',
    role: '저장소 7개 중 6개 단독 — 정적 프론트 3 + 공용 백엔드 1 + 데모 3',
    summary: '소개 사이트 세 곳의 문의 저장과 방문 분석을 공용 백엔드로 처리했습니다. 행사별 접수 기간은 고정 QR 뒤에서 서버가 판단하도록 구성했습니다.',
    highlights: ['커밋 145 / 183 · 실작업 19일', '세 번째 사이트 추가 = 백엔드 커밋 1개'],
    stack: ['React 19', 'TypeScript', 'Next.js', 'Prisma', 'PostgreSQL', 'nginx'],
    context: [
      '소개 사이트 셋의 호스팅 조건이 달랐습니다 — 둘은 사내 nginx 컨테이너, 하나는 빌드도 프록시도 없는 외부 호스팅. 그런데 셋이 서버에 요구하는 것(문의 저장, 방문 분석, 운영 대시보드)은 같아서, 프론트는 셋으로 두고 서버만 하나로 합쳤습니다.',
    ],
    decisions: [
      {
        title: '사이트마다 PostgreSQL 스키마를 통째로 분리',
        body: '테이블에 사이트 컬럼을 두는 대신 스키마를 사이트 단위로 나눠, 새 사이트 추가가 스키마 하나와 분기 하나로 끝나게 했습니다. 지원하지 않는 사이트는 컴파일 타임과 런타임 양쪽에서 막습니다.',
      },
      {
        title: '고정 QR 하나로 기간별 행사',
        body: '인쇄한 QR 은 다시 찍을 수 없어서 하나로 고정하고, 행사 기간 판정은 서버에만 뒀습니다. 클라이언트 시계를 믿으면 끝난 혜택이 계속 보입니다.',
      },
      {
        title: '공개 도메인에서 닿던 관리 콘솔 경로 차단',
        body: '한 사이트의 프록시에 파라미터를 덧붙이면 다른 사이트 데이터까지 조회될 수 있었습니다. 프록시를 없애고 사내망 직접 접속만 허용했으며, 키가 맞지 않으면 페이지 존재 자체를 숨깁니다.',
      },
    ],
    facts: [
      { label: '기여', value: '커밋 145 / 183 · 실작업 달력일 19일' },
      { label: '확장 비용', value: '세 번째 사이트 추가 = 백엔드 커밋 1개' },
      { label: '커밋 분해', value: '데모 +74,939줄 중 58.9%가 참조본·스냅샷 — 실질 17,023줄' },
    ],
    media: [
      {
        src: '/projects/intro-sooni-home.png',
        alt: 'SOONi 제품 소개 사이트 첫 화면 — AI 컨택센터 소개 문구와 채팅 상담 예시',
        caption: 'SOONi 소개 사이트',
      },
    ],
    measuredNote: GIT_SNAPSHOT_NOTE,
  },
  {
    slug: 'vibe-coding',
    keyCode: 'Digit6',
    keyLabel: '6',
    group: 'contest',
    title: 'vibe-coding 노코드 플랫폼',
    org: 'VibeCraft 팀 (5인)',
    period: '2025.05 ~ 2025.12',
    status: '공모전 출품작',
    role: 'AI 채팅 UI · SSE 스트리밍 응답 처리',
    summary: '자연어 프롬프트로 React 페이지를 만드는 노코드 플랫폼. 공모전 두 곳에서 수상했습니다.',
    highlights: ['수상 2건', '민관협력 공모전 특별상 · 오픈소스 개발자대회 우수작'],
    stack: ['React', 'TypeScript', 'SSE', 'Zustand', 'Tailwind'],
    context: [
      'LLM 응답은 토큰 단위로 도착하며 텍스트, 메뉴, 표, 완료 이벤트가 섞여 있습니다. 불완전한 블록을 이어 받아 화면에 표시해야 했습니다.',
    ],
    decisions: [
      {
        title: 'SSE 파서를 두 겹으로',
        body: '표준 파서만으로는 이벤트가 블록 단위로 오지 않을 때 메시지를 놓쳤습니다. 표준 파싱은 라이브러리에 맡기고 불완전한 블록만 자체 버퍼가 나눠, 두 경로가 같은 메시지 모델로 합류하게 했습니다.',
      },
      {
        title: '재연결 — 지수 백오프 + jitter + 이중 상한',
        body: '고정 간격이면 여러 탭이 동시에 재연결해 서버 부하가 튑니다. 지연을 지수로 늘리고 ±25% 흔들어 분산했고, 훅과 서비스 양쪽에 시도 상한을 둬 무한 재연결을 막았습니다.',
      },
      {
        title: '빈 회색 박스 회귀',
        body: '모르는 컴포넌트 타입이 섞이면 렌더러가 null 을 돌려도 바깥 래퍼가 남아 빈 박스가 보였습니다. 래퍼 자체를 조건부로 감싸 해결했습니다.',
      },
    ],
    facts: [
      { label: '수상', value: '민관협력 디지털 사회혁신 공모전 특별상 (2025.12)' },
      { label: '수상', value: '오픈소스 개발자대회 우수작 (2025.11)' },
      { label: '스트리밍', value: '커스텀 이벤트 5종 분기 · 재연결 이중 상한' },
    ],
    media: [],
    measuredNote: null,
  },
  {
    slug: 'water-account',
    keyCode: 'Digit7',
    keyLabel: '7',
    group: 'career',
    title: '물계정 데이터',
    org: '이쓰리 · 에어콕',
    period: '2024.07 ~ 2024.11',
    status: '종료',
    role: '프론트엔드 — 프론트와 백엔드가 처음으로 나뉜 환경',
    summary: '통계 차트와 데이터 내보내기 화면을 개발하고, GitHub Actions와 Docker로 배포를 자동화했습니다.',
    highlights: ['통계 시각화 · CI/CD 구축'],
    stack: ['React', 'TypeScript', 'Chart.js', 'GitHub Actions', 'Docker'],
    context: ['그전까지는 풀스택으로 서버와 화면을 같이 다뤘는데, 이 프로젝트에서 처음으로 역할이 갈렸습니다. 형태가 비슷한 페이지가 여러 개 필요했습니다.'],
    decisions: [
      {
        title: '공통으로 뺄 것과 페이지에 둘 것 가르기',
        body: '비슷한 페이지가 여럿이라 공통 로직·컴포넌트와 페이지별 코드를 나눴습니다. 이때의 기준이 이후 모노레포 공통 패키지와 디자인시스템으로 이어졌습니다.',
      },
      {
        title: 'GitHub Actions + Docker 배포 자동화',
        body: '수동 배포를 자동 빌드부터 운영 서버 반영까지 한 흐름으로 묶었습니다.',
      },
    ],
    facts: [{ label: '담당', value: '연도별·항목별 통계 시각화 · 엑셀 업·다운로드 · 갤러리·공지 관리' }],
    media: [],
    measuredNote: null,
  },
  {
    slug: 'smart-aircok',
    keyCode: 'Digit8',
    keyLabel: '8',
    group: 'career',
    title: '스마트 에어콕',
    org: '이쓰리 · 에어콕',
    period: '2022.12 ~ 2023.07',
    status: '종료',
    role: '풀스택 — React · TypeScript 프론트 + Spring Boot 백엔드',
    summary: '장비의 실시간 데이터를 차트와 도면에 표시했습니다. React 화면과 Spring Boot 인증·조회 API를 함께 개발했습니다.',
    highlights: ['TypeScript · Redux · JWT 첫 도입'],
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'Spring Boot', 'PostgreSQL', 'OpenLayers'],
    context: ['기존 모니터링 시스템이 낡았고 관리 페이지가 없었습니다. 여러 페이지가 같은 데이터를 차트·표·요약으로 다르게 보여주는 구조라 상태 설계부터 손댔습니다.'],
    decisions: [
      {
        title: '페이지마다 반복되던 fetch 를 전역 store 로',
        body: '차트·표·요약이 같은 데이터를 쓰는데 페이지마다 따로 불러오고 있었습니다. Redux Toolkit store 에 캐시해 중복 호출을 없앴습니다.',
      },
      {
        title: 'Spring Security + JWT 인증',
        body: '운영자 페이지가 관리자·사용자로 갈리고 API 접근 제어가 핵심이라 세션 대신 토큰을 썼고, 만료 시 흐름이 끊기지 않게 자동 갱신까지 설계했습니다.',
      },
    ],
    facts: [{ label: '담당', value: '실시간 데이터 시각화 · 도면 위 장비 상태 표시 · 등급별 기능 분리 · 관리 페이지' }],
    media: [],
    measuredNote: null,
  },
  {
    slug: 'forest-disaster',
    keyCode: 'Digit9',
    keyLabel: '9',
    group: 'career',
    title: '산림재해예측',
    org: '이쓰리 · 에어콕',
    period: '2022.08 ~ 2023.11',
    status: '종료',
    role: '풀스택 — 지도 시각화 화면 + TIFF 변환 서버 (현장 설치·검증 병행)',
    summary: '대용량 지리정보(TIFF)를 웹에서 볼 수 있게, 표준 지도 위에 분석 결과를 겹쳐 얹었습니다.',
    highlights: ['표준 지도 + 분석 레이어 통합'],
    stack: ['React', 'TypeScript', 'OpenLayers', 'Spring Boot', 'GeoTools', 'PostgreSQL'],
    context: ['산불 위험도 같은 연속값 예측 결과를 대용량 TIFF 로 받아 웹에 띄워야 했습니다. 정부 표준 지도와 분석 결과를 같은 좌표계에 겹치는 것이 핵심 난이도였습니다.'],
    decisions: [
      {
        title: '서버에서 TIFF → PNG 변환',
        body: '연속값을 색상 그라데이션으로 바꾸는 처리를 클라이언트에 넘기지 않고 GeoTools 로 서버에서 끝냈습니다.',
      },
      {
        title: '공통 Repository 추상화',
        body: '여러 종류의 TIFF 가 로딩 로직은 같고 스키마만 달라서, 추상 Repository 와 테이블별 구현으로 나눴습니다.',
      },
    ],
    facts: [{ label: '담당', value: 'VWORLD 타일 + 분석 레이어 통합 · TIFF 색상 변환 API' }],
    media: [],
    measuredNote: null,
  },
  {
    slug: 'aircok-baby',
    keyCode: 'Digit0',
    keyLabel: '0',
    group: 'career',
    title: '에어콕 베이비',
    org: '이쓰리 · 에어콕',
    period: '2022.08 ~ 2022.11',
    status: '종료',
    role: '풀스택 — Spring Boot 백엔드 위주 + React 프론트',
    summary: '일지 등록·조회·내보내기 API와 사용자 일지 화면을 개발했습니다. Spring Boot 백엔드를 주로 맡았고 React를 처음 도입했습니다.',
    highlights: ['React 첫 도입'],
    stack: ['React', 'Spring Boot', 'MySQL', 'Swagger'],
    context: ['임산부 공기질·건강관리 서비스입니다. 행동·식단 데이터를 xlsx · csv 로 내보내면서 첨부 이미지 목록까지 함께 담아야 했습니다.'],
    decisions: [
      {
        title: '요청 확장자별로 View 가 직렬화를 맡게',
        body: '컨트롤러를 분기하지 않고 확장자에 맞는 View 에 직렬화를 넘겨, 새 포맷 추가가 View 클래스 하나로 끝나게 했습니다.',
      },
    ],
    facts: [{ label: '담당', value: '일지 등록·조회·내보내기 API · 사용자 일지 페이지' }],
    media: [],
    measuredNote: null,
  },
  {
    slug: 'ocr-prototype',
    keyCode: 'Minus',
    keyLabel: '-',
    group: 'career',
    title: 'OCR 단말기 프로토타입',
    org: '큐오티',
    period: '2021.08 ~ 2021.12',
    status: '종료',
    role: '인턴 · OCR 단말기 프로토타입 개발',
    summary: 'C와 Python을 사용해 OCR 단말기 프로토타입을 개발했습니다.',
    highlights: ['인턴 · 5개월'],
    stack: ['C', 'Python'],
    context: ['2021년 8월부터 12월까지 인턴으로 참여했습니다.'],
    decisions: [],
    facts: [],
    media: [],
    measuredNote: null,
  },
];

const PROJECT_BY_SLUG = new Map(PROJECTS.map((project) => [project.slug, project]));
const PROJECT_BY_KEY_CODE = new Map(PROJECTS.map((project) => [project.keyCode, project]));

export const getProjectBySlug = (slug: string) => PROJECT_BY_SLUG.get(slug);
export const getProjectByKeyCode = (code: string) => PROJECT_BY_KEY_CODE.get(code);
