const APPS = ['관리자', '상담사', '데모', '채팅 위젯'] as const;
const RESPONSIBILITIES = ['화면 프레임 · 세션', '업무 데이터', '공통 UI'] as const;

export const ResponsibilityDiagram = () => (
  <figure className="responsibility-diagram">
    <svg viewBox="0 0 700 265" role="img" aria-label="관리자·상담사·데모·채팅 위젯 네 앱과 화면 프레임·세션, 업무 데이터, 공통 UI의 책임 구분">
      <path className="diagram-guide" d="M79 98V136H620V98M259 98V136M439 98V136M114 136V183M349 136V183M584 136V183" />
      {APPS.map((name, index) => <g key={name} transform={`translate(${index * 180 + 10} 24)`}><rect width="138" height="75" rx="2" /><path d="M0 20H138" /><circle cx="10" cy="10" r="2" /><text x="69" y="53" textAnchor="middle">{name}</text></g>)}
      {RESPONSIBILITIES.map((name, index) => <g key={name} transform={`translate(${index * 235 + 10} 183)`}><rect className="diagram-shared" width="208" height="55" rx="2" /><text x="104" y="34" textAnchor="middle">{name}</text></g>)}
      <text className="diagram-label" x="350" y="163" textAnchor="middle">SHARED RESPONSIBILITIES</text>
    </svg>
    <figcaption>앱과 공유 계층의 책임을 단순화한 도해</figcaption>
  </figure>
);
