import { AppRoute } from '../../utils/navigation';

export type LegalDocRoute = Exclude<AppRoute, '/'>;

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CookieInventoryRow {
  name: string;
  storageType: string;
  category: string;
  retention: string;
  purpose: string;
}

export interface LegalDocument {
  route: LegalDocRoute;
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  cookieInventory?: CookieInventoryRow[];
}

export const LEGAL_DOCUMENTS: Record<LegalDocRoute, LegalDocument> = {
  '/privacy': {
    route: '/privacy',
    eyebrow: 'Legal · Privacy Policy',
    title: 'Privacy Policy',
    subtitle:
      'How TestPilot collects, processes, protects, and respects information when you browse our website, explore interactive QA previews, or contact our team for workspace access.',
    lastUpdated: 'November 12, 2026',
    sections: [
      {
        id: 'scope',
        title: '1. Overview and Scope',
        paragraphs: [
          'This Privacy Policy describes how TestPilot handles information collected through the TestPilot marketing website, interactive workflow previews, and early-access communication channels.',
          'Interactive previews, execution traces, and sample dashboards shown on this website use fictional application data and simulated testing results. Browsing the public showcase does not grant TestPilot access to your private repositories or production systems.',
        ],
      },
      {
        id: 'information-collected',
        title: '2. Information We Collect',
        paragraphs: [
          'Depending on how you interact with TestPilot, we may handle the following categories of information:',
        ],
        bullets: [
          'Direct inquiry details: Contact information or project notes you choose to share when requesting early access or messaging our team via linked communication channels.',
          'Browser storage & consent choices: Your cookie preference selections saved locally in your browser so we respect your privacy choices across visits.',
          'Technical request metadata: Standard web delivery signals (such as browser type, viewport dimensions, referrer, and basic error telemetry) needed to deliver pages securely and diagnose reliability issues.',
        ],
      },
      {
        id: 'how-we-use',
        title: '3. How We Use Information',
        paragraphs: [
          'We process information strictly for transparent product and operational purposes:',
        ],
        bullets: [
          'Delivering, securing, and maintaining the performance of the TestPilot website.',
          'Responding to early-access, onboarding, or QA workflow inquiries initiated by you.',
          'Respecting and enforcing your chosen cookie consent settings.',
          'Understanding aggregate engagement with product documentation and workflow previews when optional analytics are enabled.',
        ],
      },
      {
        id: 'qa-workspace-data',
        title: '4. AI QA Workflows and Testing Boundaries',
        paragraphs: [
          'TestPilot is built as an AI-powered QA workspace covering AI Discovery, Manual Web Recording, AI Test Generation, AI-Assisted Healing, API & Performance Testing, and Test Evidence Investigation.',
          'Within customer workspace deployments, test scripts, recorded browser steps, execution logs, screenshots, and DOM snapshots are processed to assist QA engineers with reviewing and maintaining quality workflows. TestPilot acts as an assistive tool; QA engineers remain in control of test approval, authorization, and release validation.',
        ],
      },
      {
        id: 'cookies-reference',
        title: '5. Cookies and Similar Storage',
        paragraphs: [
          'TestPilot uses strictly necessary storage to remember your consent preferences and optional categories only when enabled by you. You can inspect our cookie inventory in the Cookie Policy or update your choices at any time using Manage Cookie Preferences.',
        ],
      },
      {
        id: 'sharing-retention',
        title: '6. Sharing, Retention, and Security',
        paragraphs: [
          'TestPilot does not sell personal information to third parties or share inquiry data for unrelated advertising.',
          'We may rely on vetted infrastructure providers (such as static hosting, font delivery, and direct messaging platforms initiated by you) strictly to operate the website and respond to your requests. Information is retained only for as long as necessary to fulfill the purpose collected or comply with applicable legal obligations.',
        ],
      },
      {
        id: 'your-rights',
        title: '7. Your Privacy Rights',
        paragraphs: [
          'Depending on your jurisdiction, you may request access to, correction of, or deletion of personal information you have submitted to us, as well as withdraw optional cookie consent at any time without affecting essential site functionality.',
        ],
      },
      {
        id: 'contact',
        title: '8. Contact and Policy Updates',
        paragraphs: [
          'We may revise this Privacy Policy as TestPilot evolves from early access to broader workspace availability. Material updates are reflected by updating the Last Updated date above.',
          'If you have privacy questions or requests, reach our team directly through the Early Access section or the official chat channel available on this website.',
        ],
      },
    ],
  },
  '/terms': {
    route: '/terms',
    eyebrow: 'Legal · Terms of Service',
    title: 'Terms of Service',
    subtitle:
      'Terms governing your access to and use of the TestPilot website, interactive QA previews, and workspace early-access evaluations.',
    lastUpdated: 'November 12, 2026',
    sections: [
      {
        id: 'acceptance',
        title: '1. Acceptance of Terms',
        paragraphs: [
          'By accessing or using the TestPilot website, interactive demonstrations, documentation, or early-access workspace features (collectively, the "Service"), you agree to be bound by these Terms of Service. If you are evaluating TestPilot on behalf of an organization, you represent that you are authorized to accept these Terms on its behalf.',
        ],
      },
      {
        id: 'service-scope',
        title: '2. Platform Description and Assistive Positioning',
        paragraphs: [
          'TestPilot provides an AI-powered QA workspace designed to help software teams reduce repetitive testing work across AI Discovery, Manual Web Recording, AI Test Generation, AI-Assisted Healing, API & Performance Testing, Execution & Reporting, and Test Evidence Investigation.',
          'Generated test flows, suggested step updates, and failure findings are provided strictly to assist QA engineers. You remain solely responsible for reviewing test logic, validating assertions, and making software release decisions.',
          'Interactive previews and sample execution artifacts presented on this landing page may rely on fictional application data and simulated results for illustration purposes.',
        ],
      },
      {
        id: 'authorized-targets',
        title: '3. Acceptable Use and Target Authorization',
        paragraphs: [
          'Automated web, API, and performance testing tools can generate meaningful load and network traffic. When configuring or using any TestPilot capability, you agree that you will:',
        ],
        bullets: [
          'Run discovery, browser automation, API requests, or performance load tests only against staging, sandbox, or production environments that you own or have explicit written authorization to test.',
          'Not use TestPilot to probe vulnerabilities on unauthorized third-party services, bypass access controls, conduct denial-of-service activity, or violate applicable laws.',
          'Maintain reasonable safeguards for credentials, API tokens, and sensitive test datasets within your testing environments.',
        ],
      },
      {
        id: 'intellectual-property',
        title: '4. Intellectual Property and Customer Artifacts',
        paragraphs: [
          'TestPilot retains all right, title, and interest in the TestPilot platform, user interface design, brand assets, and underlying software.',
          'As between you and TestPilot, you retain ownership of your target application code, custom test cases, imported test suites, and generated execution evidence. If you voluntarily provide product feedback or feature suggestions during early access, TestPilot may use that feedback to improve the platform without obligation.',
        ],
      },
      {
        id: 'availability',
        title: '5. Early Access and Service Availability',
        paragraphs: [
          'Certain capabilities described on this website are evolving or offered through controlled early-access onboarding. Features marked "Soon" represent planned or private capabilities and do not constitute a binding commitment to deliver a specific feature on a fixed schedule.',
        ],
      },
      {
        id: 'disclaimers',
        title: '6. Disclaimers and Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by applicable law, the public website and interactive previews are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, or non-infringement.',
          'To the maximum extent permitted by law, TestPilot will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or software availability arising from your use of the website or reliance on automated test recommendations without human QA verification.',
        ],
      },
      {
        id: 'changes',
        title: '7. Suspension and Updates to These Terms',
        paragraphs: [
          'We may restrict or suspend access to the Service if we detect abusive traffic, unauthorized security probing, or violations of these Terms.',
          'We may update these Terms from time to time by posting a revised version on this page with an updated Last Updated date. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.',
        ],
      },
    ],
  },
  '/cookies': {
    route: '/cookies',
    eyebrow: 'Legal · Cookie Policy',
    title: 'Cookie Policy',
    subtitle:
      'Transparent overview of cookies and local browser storage used by TestPilot, along with controls to inspect or update your preferences anytime.',
    lastUpdated: 'November 12, 2026',
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. What Are Cookies and Browser Storage',
        paragraphs: [
          'Cookies and local storage entries are small pieces of data stored by your browser when you visit a website. They help preserve core site behavior, remember your consent decisions, and optionally keep UI preferences across visits.',
        ],
      },
      {
        id: 'categories',
        title: '2. Categories Used on TestPilot',
        paragraphs: [
          'TestPilot organizes browser storage into three clear categories:',
        ],
        bullets: [
          'Strictly Necessary: Always active. Used to record your cookie consent decision and preserve essential site navigation without repeatedly re-prompting you.',
          'Analytics & Telemetry (Optional): Disabled by default unless you choose to enable it. Helps measure aggregate interaction with product workflows and documentation.',
          'Functional Preferences (Optional): Remembers non-essential workspace preview state such as selected tabs or view filters.',
        ],
      },
      {
        id: 'inventory',
        title: '3. Cookie and Storage Inventory',
        paragraphs: [
          'The table below documents the first-party storage keys currently written by TestPilot:',
        ],
      },
      {
        id: 'manage-controls',
        title: '4. How to Manage or Withdraw Consent',
        paragraphs: [
          'You can modify or withdraw optional cookie consent at any time using the "Manage Cookie Preferences" button below or the "Cookie Preferences" trigger in the site footer.',
          'You may also clear cookies and site storage directly through your browser settings at any time; clearing essential consent storage will display the consent banner again on your next visit.',
        ],
      },
    ],
    cookieInventory: [
      {
        name: 'testpilot_consent',
        storageType: 'First-party Cookie',
        category: 'Strictly Necessary',
        retention: '180 days',
        purpose:
          'Stores a serialized summary of your essential, analytics, and functional consent flags with SameSite=Lax.',
      },
      {
        name: 'testpilot.cookie_consent.v1',
        storageType: 'Browser localStorage',
        category: 'Strictly Necessary',
        retention: 'Until cleared',
        purpose:
          'Persists detailed consent category settings and timestamp locally so the banner stays dismissed across page reloads.',
      },
    ],
  },
};

