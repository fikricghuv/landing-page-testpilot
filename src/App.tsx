import React, { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero/Hero';
import { Problem } from './components/sections/Problem/Problem';
import { HowItWorks } from './components/sections/HowItWorks/HowItWorks';
import { Product } from './components/sections/Product/Product';
import { Traces } from './components/sections/Traces/Traces';
import { Vision } from './components/sections/Vision/Vision';
import { BuiltFor } from './components/sections/BuiltFor/BuiltFor';
import { Showcase } from './components/sections/Showcase/Showcase';
import { GetStarted } from './components/sections/GetStarted/GetStarted';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloat } from './components/floating/WhatsAppFloat';
import { ParticleOverlay } from './components/floating/ParticleOverlay';
import { CookieConsent } from './components/cookies/CookieConsent';
import { LegalPage } from './components/legal/LegalPage';
import { AppRoute, useAppRoute } from './utils/navigation';
import { DiscoveryProvider } from './components/discovery/DiscoveryContext';
import { DiscoveryModal } from './components/discovery/DiscoveryModal';

const ROUTE_TITLES: Record<AppRoute, string> = {
  '/': 'TestPilot | AI-Powered QA Workspace',
  '/privacy': 'Privacy Policy | TestPilot',
  '/terms': 'Terms of Service | TestPilot',
  '/cookies': 'Cookie Policy | TestPilot',
};

export const App: React.FC = () => {
  const { route, navigate } = useAppRoute();

  useEffect(() => {
    document.title = ROUTE_TITLES[route];
  }, [route]);

  useEffect(() => {
    const handleDocumentLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = (event.target as HTMLElement | null)?.closest('a[href]');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      if (href === '/') {
        event.preventDefault();
        navigate('/');
        return;
      }

      if (route !== '/' && href.startsWith('#')) {
        const id = href.slice(1);
        if (id && !document.getElementById(id)) {
          event.preventDefault();
          navigate('/', id);
        }
      }
    };

    document.addEventListener('click', handleDocumentLinkClick);
    return () => document.removeEventListener('click', handleDocumentLinkClick);
  }, [route, navigate]);

  return (
    <DiscoveryProvider>
      <div className="min-h-screen bg-canvas text-ink antialiased selection:bg-sky-tint selection:text-midnight">
        <a
          className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          href="#main"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main">
          {route === '/' ? (
            <>
              <Hero />
              <Problem />
              <HowItWorks />
              <Product />
              <Traces />
              <Vision />
              <BuiltFor />
              <Showcase />
              <GetStarted />
            </>
          ) : (
            <LegalPage onNavigate={navigate} route={route} />
          )}
        </main>

        <Footer onNavigate={navigate} />

        <WhatsAppFloat />
        <CookieConsent onNavigate={navigate} />
        <ParticleOverlay />
        <DiscoveryModal />
      </div>
    </DiscoveryProvider>
  );
};

export default App;
