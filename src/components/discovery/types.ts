export type HelpTopic =
  | 'Manual Testing'
  | 'Automation Testing'
  | 'API Testing'
  | 'Performance Testing'
  | 'Test Management & Reporting';

export type TestingChallenge =
  | 'Too much repetitive manual work'
  | 'Creating automation scripts takes too long'
  | 'Maintaining existing automation tests is difficult'
  | 'Testing execution takes too much time'
  | 'Reporting and collaboration are inefficient'
  | 'Understanding why tests fail takes too much effort';

export type WorkRole =
  | 'Individual QA Engineer'
  | 'QA Team'
  | 'QA Lead / Manager'
  | 'Software Development Team';

export interface DiscoverySelections {
  helpTopics: HelpTopic[];
  challenges: TestingChallenge[];
  workRole: WorkRole | null;
}

export interface RecommendedFeature {
  id: string;
  badge: string;
  title: string;
  description: string;
  iconType: 'discovery' | 'automation' | 'healing' | 'api' | 'performance' | 'reporting' | 'collaboration';
  matchedBecause: string;
}

export interface RecommendationResult {
  headline: string;
  summary: string;
  roleInsight: string;
  features: RecommendedFeature[];
}
