import React from 'react';
import { openCookiePreferencesModal } from '../../utils/cookieConsent';
import { AppRoute, navigateTo } from '../../utils/navigation';

interface FooterNavItem {
  label: string;
  href?: string;
}

interface FooterNavGroup {
  heading: string;
  items: FooterNavItem[];
}

interface FooterProps {
  onNavigate?: (route: AppRoute, sectionHash?: string) => void;
}

const FOOTER_LINK_CLASS =
  'inline-block rounded py-0.5 transition-colors hover:text-canvas focus-visible:ring-2 focus-visible:ring-lime';

const FOOTER_GROUPS: FooterNavGroup[] = [
  {
    heading: 'Product',
    items: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'AI Discovery', href: '#product' },
      { label: 'Manual Web Recording', href: '#product' },
      { label: 'AI Test Generation', href: '#product' },
      { label: 'API & Performance Testing', href: '#product' },
      { label: 'Test Evidence', href: '#traces' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Interactive Demo', href: '#demo' },
      { label: 'Showcase', href: '#showcase' },
      { label: 'Blog' },
      { label: 'Updates' },
      { label: 'FAQ' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'Our Approach', href: '#vision' },
      { label: 'Built for QA Teams', href: '#built-for' },
      { label: 'Early Access', href: '#get-started' },
      { label: 'About' },
      { label: 'Contact' },
    ],
  },
];

const LEGAL_LINKS: Array<{ label: string; route: Exclude<AppRoute, '/'> }> = [
  { label: 'Privacy', route: '/privacy' },
  { label: 'Terms', route: '/terms' },
  { label: 'Cookies', route: '/cookies' },
];

const UnavailableLabel: React.FC<{ label: string }> = ({ label }) => (
  <span aria-disabled="true" className="inline-flex items-center gap-1.5 text-space">
    <span>{label}</span>
    <span className="rounded bg-canvas/10 px-1.5 py-0.5 font-mono text-[10px] text-steel">
      Soon
    </span>
  </span>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate = navigateTo }) => {
  const currentYear = new Date().getFullYear();

  const handleLegalClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    route: Exclude<AppRoute, '/'>,
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(route);
  };

  return (
    <footer className="relative bg-midnight pb-10 pt-20 text-canvas">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-10 border-t border-[var(--hairline-dark)] pt-12 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-5">
            <a
              aria-label="TestPilot — Back to top"
              className="inline-flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-lime"
              href="#main"
            >
              <svg
                aria-hidden="true"
                className="h-[28px] w-[33px] sm:h-[32px] sm:w-[38px] shrink-0"
                height="32"
                width="38"
                viewBox="54 52 920 780"
              >
                <g transform="translate(0, 888) scale(0.1, -0.1)" fill="var(--color-sky)">
                  <path d="M6895 8056 c-77 -36 -92 -58 -136 -191 -6 -19 -9 -231 -7 -560 2 -462 4 -537 19 -585 9 -30 19 -69 23 -86 8 -36 65 -97 115 -125 20 -11 43 -23 51 -28 57 -32 86 -47 175 -92 55 -29 118 -62 140 -75 22 -13 51 -29 65 -35 14 -6 32 -15 40 -20 8 -5 33 -18 55 -29 22 -11 47 -24 55 -28 8 -5 23 -13 33 -18 10 -5 26 -21 35 -37 14 -22 14 -31 4 -47 -6 -11 -12 -31 -12 -46 0 -14 -9 -37 -20 -51 -11 -14 -20 -37 -20 -52 0 -14 -7 -38 -14 -53 -8 -16 -18 -49 -22 -75 -4 -27 -15 -64 -25 -83 -11 -19 -19 -43 -19 -53 0 -16 -21 -90 -52 -182 -6 -16 -16 -55 -24 -85 -7 -30 -20 -80 -29 -110 -17 -59 -13 -110 11 -144 8 -11 14 -30 14 -42 0 -26 62 -84 121 -115 93 -47 238 -7 340 93 27 27 52 48 55 48 3 0 29 18 57 40 132 102 223 174 237 187 52 48 106 93 114 93 4 0 18 9 30 20 11 11 68 56 126 100 58 44 114 89 125 99 11 10 60 48 108 85 92 70 96 73 168 136 25 22 49 40 53 40 4 0 32 19 62 43 29 23 84 65 120 92 284 215 314 246 355 367 39 116 25 229 -48 362 -18 33 -103 116 -119 116 -6 0 -16 6 -22 13 -6 6 -41 28 -79 47 -37 19 -72 40 -76 47 -4 7 -14 13 -22 13 -17 0 -102 40 -135 63 -13 9 -32 17 -41 17 -9 0 -24 9 -34 20 -10 11 -26 20 -35 20 -10 0 -28 8 -41 18 -35 25 -61 41 -84 51 -54 24 -75 34 -140 71 -38 21 -101 55 -140 75 -38 20 -92 49 -120 64 -27 15 -117 63 -200 106 -173 89 -269 141 -322 172 -21 13 -49 28 -63 34 -14 6 -32 15 -40 20 -13 7 -192 96 -230 113 -8 4 -37 20 -65 36 -27 16 -102 54 -165 86 -103 52 -123 58 -185 61 -57 2 -80 -2 -120 -21z" />
                  <path d="M2385 6971 c-54 -4 -103 -14 -122 -24 -18 -9 -47 -17 -66 -17 -71 0 -346 -112 -483 -196 -16 -10 -52 -32 -79 -49 -26 -16 -60 -40 -74 -52 -136 -116 -186 -163 -251 -239 -41 -48 -88 -101 -103 -118 -16 -17 -45 -56 -65 -86 -20 -30 -39 -57 -42 -60 -13 -10 -110 -190 -110 -203 0 -8 -8 -25 -19 -38 -10 -13 -21 -35 -24 -49 -8 -36 -37 -118 -58 -166 -11 -23 -19 -48 -19 -57 0 -9 -9 -53 -20 -99 -13 -53 -20 -118 -20 -179 0 -86 2 -97 23 -116 12 -11 29 -23 39 -26 9 -3 896 -7 1972 -8 1076 -1 1956 -5 1956 -8 0 -3 -22 -18 -49 -33 -26 -15 -54 -34 -61 -43 -7 -8 -19 -15 -27 -15 -8 0 -28 -10 -43 -22 -15 -13 -49 -36 -76 -53 -51 -32 -55 -34 -160 -108 -38 -26 -91 -62 -119 -79 -27 -18 -52 -35 -55 -39 -6 -8 -81 -62 -160 -116 -30 -20 -62 -44 -71 -52 -10 -9 -36 -32 -60 -51 -114 -92 -389 -388 -389 -418 0 -6 -6 -15 -13 -19 -11 -7 -78 -105 -115 -168 -25 -44 -102 -202 -115 -240 -8 -22 -25 -65 -37 -95 -12 -30 -27 -77 -32 -105 -5 -27 -16 -70 -23 -95 -7 -25 -16 -64 -19 -86 -3 -23 -6 -561 -6 -1195 0 -1141 0 -1154 20 -1181 11 -15 20 -31 20 -37 0 -15 54 -56 105 -81 40 -19 58 -22 123 -18 68 5 86 10 152 49 41 23 77 46 80 50 3 4 21 14 40 23 19 9 49 24 65 35 27 16 54 32 126 73 13 7 32 19 41 26 16 13 44 29 113 66 17 9 48 27 70 40 22 14 54 32 70 40 17 9 53 29 80 46 28 16 71 41 97 55 26 13 49 29 52 34 4 5 35 24 71 41 36 17 67 36 71 41 3 5 20 16 37 25 18 8 44 21 58 29 34 19 129 113 129 127 0 6 8 20 18 31 43 48 45 82 51 889 l6 766 23 31 c12 16 22 37 22 44 0 8 21 31 48 50 26 20 53 42 60 48 7 6 25 15 40 19 15 5 45 16 67 24 24 9 75 15 130 16 50 0 115 7 145 15 30 9 73 20 95 26 21 5 44 14 50 18 5 5 26 12 45 16 19 4 49 16 66 26 17 10 37 19 43 19 13 0 114 44 141 61 8 5 24 13 35 18 12 5 27 16 34 25 7 9 19 16 25 16 6 0 35 18 64 40 29 22 55 40 58 40 8 0 94 75 178 155 69 66 196 215 196 230 0 4 9 14 19 23 11 10 31 38 44 63 13 26 31 57 40 70 10 13 17 31 17 40 0 9 9 24 20 34 11 10 20 24 20 32 0 7 9 30 20 50 11 21 20 45 20 53 0 8 9 29 20 45 11 17 20 41 20 55 0 14 9 45 20 69 11 24 20 56 20 72 0 16 8 48 18 71 25 63 25 510 -1 611 -9 38 -17 79 -17 93 0 13 -9 41 -20 61 -11 21 -20 48 -20 60 0 21 -8 42 -61 159 -11 23 -19 48 -19 56 0 8 -9 23 -20 33 -11 10 -20 28 -20 40 0 12 -9 30 -20 40 -11 10 -20 24 -20 31 0 7 -18 35 -40 63 -22 28 -40 54 -40 59 0 12 -89 125 -106 135 -8 4 -14 12 -14 17 0 15 -173 177 -255 238 -93 70 -134 99 -155 109 -29 14 -54 30 -89 56 -13 9 -33 17 -44 17 -11 0 -28 6 -36 14 -15 13 -39 24 -131 56 -19 7 -50 19 -68 26 -18 8 -64 19 -103 25 -39 6 -87 18 -107 27 -34 16 -157 17 -1452 18 -778 1 -1455 -2 -1505 -5z" />
                </g>
              </svg>
              <span className="text-[20px] font-bold tracking-tight text-canvas">
                Test<span className="text-sky">Pilot</span>
              </span>
            </a>
            <p className="mt-4 text-[15px] font-semibold text-canvas">
              Spend Less Time Testing. Focus More on Quality.
            </p>
            <p className="mt-2 max-w-[36ch] text-[13.5px] leading-relaxed text-steel">
              An AI-powered QA workspace designed to help teams simplify testing workflows and focus
              on software quality.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-8 lg:col-span-7">
            {FOOTER_GROUPS.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <p className="t-label text-space">{group.heading}</p>
                <ul className="mt-4 space-y-2.5 text-[14px] text-steel">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a className={FOOTER_LINK_CLASS} href={item.href}>
                          {item.label}
                        </a>
                      ) : (
                        <UnavailableLabel label={item.label} />
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="mt-14 select-none text-phantom">
          <svg className="h-auto w-full select-none" viewBox="0 0 980 200">
            <g fill="currentColor">
              {/* TestPilot Monogram Logo Mark */}
              <g transform="translate(10, 20) scale(0.205) translate(-54, -52)">
                <g transform="translate(0, 888) scale(0.1, -0.1)">
                  <path d="M6895 8056 c-77 -36 -92 -58 -136 -191 -6 -19 -9 -231 -7 -560 2 -462 4 -537 19 -585 9 -30 19 -69 23 -86 8 -36 65 -97 115 -125 20 -11 43 -23 51 -28 57 -32 86 -47 175 -92 55 -29 118 -62 140 -75 22 -13 51 -29 65 -35 14 -6 32 -15 40 -20 8 -5 33 -18 55 -29 22 -11 47 -24 55 -28 8 -5 23 -13 33 -18 10 -5 26 -21 35 -37 14 -22 14 -31 4 -47 -6 -11 -12 -31 -12 -46 0 -14 -9 -37 -20 -51 -11 -14 -20 -37 -20 -52 0 -14 -7 -38 -14 -53 -8 -16 -18 -49 -22 -75 -4 -27 -15 -64 -25 -83 -11 -19 -19 -43 -19 -53 0 -16 -21 -90 -52 -182 -6 -16 -16 -55 -24 -85 -7 -30 -20 -80 -29 -110 -17 -59 -13 -110 11 -144 8 -11 14 -30 14 -42 0 -26 62 -84 121 -115 93 -47 238 -7 340 93 27 27 52 48 55 48 3 0 29 18 57 40 132 102 223 174 237 187 52 48 106 93 114 93 4 0 18 9 30 20 11 11 68 56 126 100 58 44 114 89 125 99 11 10 60 48 108 85 92 70 96 73 168 136 25 22 49 40 53 40 4 0 32 19 62 43 29 23 84 65 120 92 284 215 314 246 355 367 39 116 25 229 -48 362 -18 33 -103 116 -119 116 -6 0 -16 6 -22 13 -6 6 -41 28 -79 47 -37 19 -72 40 -76 47 -4 7 -14 13 -22 13 -17 0 -102 40 -135 63 -13 9 -32 17 -41 17 -9 0 -24 9 -34 20 -10 11 -26 20 -35 20 -10 0 -28 8 -41 18 -35 25 -61 41 -84 51 -54 24 -75 34 -140 71 -38 21 -101 55 -140 75 -38 20 -92 49 -120 64 -27 15 -117 63 -200 106 -173 89 -269 141 -322 172 -21 13 -49 28 -63 34 -14 6 -32 15 -40 20 -13 7 -192 96 -230 113 -8 4 -37 20 -65 36 -27 16 -102 54 -165 86 -103 52 -123 58 -185 61 -57 2 -80 -2 -120 -21z" />
                  <path d="M2385 6971 c-54 -4 -103 -14 -122 -24 -18 -9 -47 -17 -66 -17 -71 0 -346 -112 -483 -196 -16 -10 -52 -32 -79 -49 -26 -16 -60 -40 -74 -52 -136 -116 -186 -163 -251 -239 -41 -48 -88 -101 -103 -118 -16 -17 -45 -56 -65 -86 -20 -30 -39 -57 -42 -60 -13 -10 -110 -190 -110 -203 0 -8 -8 -25 -19 -38 -10 -13 -21 -35 -24 -49 -8 -36 -37 -118 -58 -166 -11 -23 -19 -48 -19 -57 0 -9 -9 -53 -20 -99 -13 -53 -20 -118 -20 -179 0 -86 2 -97 23 -116 12 -11 29 -23 39 -26 9 -3 896 -7 1972 -8 1076 -1 1956 -5 1956 -8 0 -3 -22 -18 -49 -33 -26 -15 -54 -34 -61 -43 -7 -8 -19 -15 -27 -15 -8 0 -28 -10 -43 -22 -15 -13 -49 -36 -76 -53 -51 -32 -55 -34 -160 -108 -38 -26 -91 -62 -119 -79 -27 -18 -52 -35 -55 -39 -6 -8 -81 -62 -160 -116 -30 -20 -62 -44 -71 -52 -10 -9 -36 -32 -60 -51 -114 -92 -389 -388 -389 -418 0 -6 -6 -15 -13 -19 -11 -7 -78 -105 -115 -168 -25 -44 -102 -202 -115 -240 -8 -22 -25 -65 -37 -95 -12 -30 -27 -77 -32 -105 -5 -27 -16 -70 -23 -95 -7 -25 -16 -64 -19 -86 -3 -23 -6 -561 -6 -1195 0 -1141 0 -1154 20 -1181 11 -15 20 -31 20 -37 0 -15 54 -56 105 -81 40 -19 58 -22 123 -18 68 5 86 10 152 49 41 23 77 46 80 50 3 4 21 14 40 23 19 9 49 24 65 35 27 16 54 32 126 73 13 7 32 19 41 26 16 13 44 29 113 66 17 9 48 27 70 40 22 14 54 32 70 40 17 9 53 29 80 46 28 16 71 41 97 55 26 13 49 29 52 34 4 5 35 24 71 41 36 17 67 36 71 41 3 5 20 16 37 25 18 8 44 21 58 29 34 19 129 113 129 127 0 6 8 20 18 31 43 48 45 82 51 889 l6 766 23 31 c12 16 22 37 22 44 0 8 21 31 48 50 26 20 53 42 60 48 7 6 25 15 40 19 15 5 45 16 67 24 24 9 75 15 130 16 50 0 115 7 145 15 30 9 73 20 95 26 21 5 44 14 50 18 5 5 26 12 45 16 19 4 49 16 66 26 17 10 37 19 43 19 13 0 114 44 141 61 8 5 24 13 35 18 12 5 27 16 34 25 7 9 19 16 25 16 6 0 35 18 64 40 29 22 55 40 58 40 8 0 94 75 178 155 69 66 196 215 196 230 0 4 9 14 19 23 11 10 31 38 44 63 13 26 31 57 40 70 10 13 17 31 17 40 0 9 9 24 20 34 11 10 20 24 20 32 0 7 9 30 20 50 11 21 20 45 20 53 0 8 9 29 20 45 11 17 20 41 20 55 0 14 9 45 20 69 11 24 20 56 20 72 0 16 8 48 18 71 25 63 25 510 -1 611 -9 38 -17 79 -17 93 0 13 -9 41 -20 61 -11 21 -20 48 -20 60 0 21 -8 42 -61 159 -11 23 -19 48 -19 56 0 8 -9 23 -20 33 -11 10 -20 28 -20 40 0 12 -9 30 -20 40 -11 10 -20 24 -20 31 0 7 -18 35 -40 63 -22 28 -40 54 -40 59 0 12 -89 125 -106 135 -8 4 -14 12 -14 17 0 15 -173 177 -255 238 -93 70 -134 99 -155 109 -29 14 -54 30 -89 56 -13 9 -33 17 -44 17 -11 0 -28 6 -36 14 -15 13 -39 24 -131 56 -19 7 -50 19 -68 26 -18 8 -64 19 -103 25 -39 6 -87 18 -107 27 -34 16 -157 17 -1452 18 -778 1 -1455 -2 -1505 -5z" />
                </g>
              </g>
              {/* TestPilot Typography */}
              <text
                x="235"
                y="152"
                fontFamily="var(--font-sans), system-ui, -apple-system, sans-serif"
                fontSize="155"
                fontWeight="800"
                letterSpacing="-0.04em"
              >
                TestPilot
              </text>
            </g>
          </svg>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-[12.5px] text-space sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {currentYear} TestPilot. All rights reserved.</span>
            {LEGAL_LINKS.map((item) => (
              <a
                key={item.route}
                className={FOOTER_LINK_CLASS}
                href={item.route}
                onClick={(e) => handleLegalClick(e, item.route)}
              >
                {item.label}
              </a>
            ))}
            <button
              className={`${FOOTER_LINK_CLASS} cursor-pointer text-left`}
              onClick={openCookiePreferencesModal}
              type="button"
            >
              Cookie Preferences
            </button>
          </div>
          <p>
            Product demonstrations may use fictional application data and simulated testing
            results.
          </p>
        </div>
      </div>
    </footer>
  );
};
