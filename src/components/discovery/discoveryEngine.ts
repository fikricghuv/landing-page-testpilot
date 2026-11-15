import { DiscoverySelections, HelpTopic, RecommendationResult, RecommendedFeature } from './types';

export const ALL_HELP_TOPICS: readonly HelpTopic[] = [
  'Manual Testing',
  'Automation Testing',
  'API Testing',
  'Performance Testing',
  'Test Management & Reporting',
] as const;

export const ALL_CHALLENGES = [
  'Too much repetitive manual work',
  'Creating automation scripts takes too long',
  'Maintaining existing automation tests is difficult',
  'Testing execution takes too much time',
  'Reporting and collaboration are inefficient',
  'Understanding why tests fail takes too much effort',
] as const;

export const ALL_WORK_ROLES = [
  'Individual QA Engineer',
  'QA Team',
  'QA Lead / Manager',
  'Software Development Team',
] as const;

export function generateRecommendations(selections: DiscoverySelections): RecommendationResult {
  const { helpTopics, challenges, workRole } = selections;
  const features: RecommendedFeature[] = [];

  const hasHelp = (t: HelpTopic) => helpTopics.includes(t);
  const hasChallenge = (c: string) => challenges.includes(c as any);

  // 1. AI Discovery
  if (hasHelp('Manual Testing') || hasChallenge('Too much repetitive manual work')) {
    features.push({
      id: 'ai-discovery',
      badge: 'Discovery & Flow Analysis',
      title: 'AI Discovery',
      description: 'Explore application structures, identify interactive UI elements, and map candidate user journeys as a foundation for testing.',
      iconType: 'discovery',
      matchedBecause: hasHelp('Manual Testing')
        ? 'Matched from your Manual Testing scope'
        : 'Matched from your repetitive manual work challenge',
    });
  }

  // 2. Manual Web Recording
  if (hasHelp('Manual Testing') && !hasHelp('Automation Testing')) {
    features.push({
      id: 'web-recording',
      badge: 'Live Flow Capture',
      title: 'Interactive Web Recorder',
      description: 'Perform real browser clicks and form inputs while TestPilot captures reliable locators into reusable, parameterized test steps.',
      iconType: 'discovery',
      matchedBecause: 'Matched to capture manual exploratory sessions into reusable assets',
    });
  }

  // 3. AI Test Generation
  if (hasHelp('Automation Testing') || hasChallenge('Creating automation scripts takes too long')) {
    features.push({
      id: 'ai-test-generation',
      badge: 'Reviewable Scripts',
      title: 'AI Test Generation',
      description: 'Convert test scenarios and app context into reviewable Playwright and Cypress scripts with editable selectors and assertions.',
      iconType: 'automation',
      matchedBecause: hasChallenge('Creating automation scripts takes too long')
        ? 'Matched from your script creation velocity bottleneck'
        : 'Matched from your Automation Testing scope',
    });
  }

  // 4. AI-Assisted Healing
  if (
    hasChallenge('Maintaining existing automation tests is difficult') ||
    (hasHelp('Automation Testing') && hasChallenge('Understanding why tests fail takes too much effort'))
  ) {
    features.push({
      id: 'ai-assisted-healing',
      badge: 'Locator Recovery',
      title: 'AI-Assisted Healing',
      description: 'Investigate broken locators with DOM context analysis, identify candidate replacements, and validate fixes for QA review.',
      iconType: 'healing',
      matchedBecause: 'Matched from your test maintenance and selector flakiness challenges',
    });
  }

  // 5. API Testing
  if (hasHelp('API Testing')) {
    features.push({
      id: 'api-testing',
      badge: 'Backend Validation',
      title: 'API Testing & Schema Validation',
      description: 'Validate REST and GraphQL endpoints, JSON response payloads, and mock dependent services seamlessly alongside UI test suites.',
      iconType: 'api',
      matchedBecause: 'Matched from your API Testing scope',
    });
  }

  // 6. Performance Testing
  if (hasHelp('Performance Testing')) {
    features.push({
      id: 'performance-testing',
      badge: 'Load & Metrics',
      title: 'Performance Testing',
      description: 'Simulate concurrent user traffic, evaluate p95 latency under stress, and inspect Core Web Vitals before production release.',
      iconType: 'performance',
      matchedBecause: 'Matched from your Performance Testing scope',
    });
  }

  // 7. Test Execution & Reporting (Central Cockpit & Root-Cause Triage)
  if (
    hasHelp('Test Management & Reporting') ||
    hasChallenge('Understanding why tests fail takes too much effort') ||
    hasChallenge('Testing execution takes too much time') ||
    hasChallenge('Reporting and collaboration are inefficient')
  ) {
    let reason = 'Matched from your test management & reporting scope';
    if (hasChallenge('Understanding why tests fail takes too much effort')) {
      reason = 'Matched to help triage failed tests with visual traces and DOM logs';
    } else if (hasChallenge('Testing execution takes too much time')) {
      reason = 'Matched to streamline parallel execution and centralized run verdicts';
    }

    features.push({
      id: 'test-execution-reporting',
      badge: 'Unified Execution Cockpit',
      title: 'Test Execution & Reporting',
      description: 'Centralize cross-browser runs with video replays, console logs, network events, and exportable evidence for root-cause diagnosis.',
      iconType: 'reporting',
      matchedBecause: reason,
    });
  }

  // 8. Team Collaboration & CI/CD Integrations
  if (
    hasChallenge('Reporting and collaboration are inefficient') &&
    features.length < 4
  ) {
    features.push({
      id: 'team-collaboration',
      badge: 'Team Integrations',
      title: 'Team Collaboration & Integrations',
      description: 'Share triage findings with developers via Jira and Slack, and automate regression gates inside your GitHub/GitLab CI pipeline.',
      iconType: 'collaboration',
      matchedBecause: 'Matched from your team collaboration and reporting efficiency bottleneck',
    });
  }

  // Fallback safety: ensure at least 2 relevant recommendations exist
  if (features.length === 0) {
    features.push(
      {
        id: 'ai-discovery',
        badge: 'Discovery & Flow Analysis',
        title: 'AI Discovery',
        description: 'Explore application structures, identify interactive elements, and discover candidate test journeys automatically.',
        iconType: 'discovery',
        matchedBecause: 'Recommended baseline for modern application exploration',
      },
      {
        id: 'ai-test-generation',
        badge: 'Reviewable Scripts',
        title: 'AI Test Generation',
        description: 'Generate reviewable Playwright and Cypress test automation scripts while QA maintains complete oversight.',
        iconType: 'automation',
        matchedBecause: 'Recommended baseline to reduce repetitive test script drafting',
      }
    );
  } else if (features.length === 1) {
    // If only 1 feature, add a natural complementary companion
    if (features[0].id === 'performance-testing' || features[0].id === 'api-testing') {
      features.push({
        id: 'test-execution-reporting',
        badge: 'Execution Evidence',
        title: 'Test Execution & Reporting',
        description: 'Collect status verdicts, response time logs, and failure evidence in one centralized dashboard.',
        iconType: 'reporting',
        matchedBecause: 'Recommended companion to track and audit your test results',
      });
    } else if (features[0].id === 'ai-test-generation') {
      features.push({
        id: 'ai-assisted-healing',
        badge: 'Locator Recovery',
        title: 'AI-Assisted Healing',
        description: 'Inspect DOM changes when selectors fail and evaluate alternative locator suggestions before scripts break.',
        iconType: 'healing',
        matchedBecause: 'Recommended companion to prevent test flakiness as applications evolve',
      });
    }
  }

  // Cap to top 4 features to prevent visual overflow
  const cappedFeatures = features.slice(0, 4);

  // Dynamic Headline tailored to primary focus
  let headline = 'Your QA Workflow Can Be More Efficient.';
  if (hasHelp('Automation Testing')) {
    headline = 'Accelerate Automation While Keeping QA in Control.';
  } else if (hasHelp('Manual Testing')) {
    headline = 'Turn Manual Exploratory Walks into Reusable Tests.';
  } else if (hasHelp('API Testing') || hasHelp('Performance Testing')) {
    headline = 'Extend Test Coverage Beyond Front-End UI.';
  } else if (hasHelp('Test Management & Reporting') || workRole === 'QA Lead / Manager') {
    headline = 'Centralize Evidence and Speed Up Failure Triage.';
  }

  // Role insight customization
  let roleInsight = '';
  switch (workRole) {
    case 'Individual QA Engineer':
      roleInsight =
        'TestPilot drafts boilerplate test scripts and inspects locators while you focus on exploratory quality.';
      break;
    case 'QA Team':
      roleInsight =
        'TestPilot centralizes test suites, suggests self-healing locators, and unifies execution evidence for your team.';
      break;
    case 'QA Lead / Manager':
      roleInsight =
        'TestPilot delivers clear visibility into test health, flakiness reduction, and regression speed for release decisions.';
      break;
    case 'Software Development Team':
      roleInsight =
        'TestPilot embeds automated regression quality gates directly into your CI pipeline before staging deployments.';
      break;
    default:
      roleInsight =
        'TestPilot streamlines test drafting, locator healing, and failure triage while keeping QA in control.';
  }

  return {
    headline,
    summary: 'Based on your selections, TestPilot helps streamline these key areas of your testing lifecycle:',
    roleInsight,
    features: cappedFeatures,
  };
}
