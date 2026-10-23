export type ArtifactKind = 'apps' | 'components' | 'calls' | 'document';

export interface CaseSection {
  title: string;
  paragraphs: readonly string[];
}

export interface CaseStudy {
  slug: string;
  number: string;
  name: string;
  category: string;
  title: string;
  role: string;
  artifact: ArtifactKind;
  sections: readonly CaseSection[];
  result: string;
  scope: readonly { value: string; label: string }[];
  note?: string;
}

export interface DemoStep {
  label: string;
  left: string;
  right: string;
  event: string;
  description: string;
}

export interface DemoScenario {
  title: string;
  actors: readonly [string, string];
  steps: readonly DemoStep[];
}
