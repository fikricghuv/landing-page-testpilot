import { useCallback, useEffect, useState } from 'react';

export type AppRoute = '/' | '/privacy' | '/terms' | '/cookies';

const ROUTE_CHANGE_EVENT = 'testpilot:route-change';

const ROUTE_ALIASES: Record<string, AppRoute> = {
  '/': '/',
  '/privacy': '/privacy',
  '/privacy-policy': '/privacy',
  '/terms': '/terms',
  '/terms-of-service': '/terms',
  '/cookies': '/cookies',
  '/cookie-policy': '/cookies',
};

const HASH_ROUTE_ALIASES: Record<string, AppRoute> = {
  '#privacy': '/privacy',
  '#/privacy': '/privacy',
  '#terms': '/terms',
  '#/terms': '/terms',
  '#cookies': '/cookies',
  '#/cookies': '/cookies',
};

export function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

export function getRouteFromLocation(): AppRoute {
  if (typeof window === 'undefined') return '/';

  const hash = window.location.hash.toLowerCase();
  if (hash in HASH_ROUTE_ALIASES) {
    return HASH_ROUTE_ALIASES[hash];
  }

  const normalized = normalizePathname(window.location.pathname.toLowerCase());
  return ROUTE_ALIASES[normalized] ?? '/';
}

export function scrollToSectionId(id: string): void {
  const cleanId = id.replace(/^#/, '');
  if (!cleanId) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(cleanId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

export function navigateTo(route: AppRoute, sectionHash?: string): void {
  if (typeof window === 'undefined') return;

  const cleanHash = sectionHash ? `#${sectionHash.replace(/^#/, '')}` : '';
  const targetUrl = `${route}${cleanHash}`;
  const currentUrl = `${normalizePathname(window.location.pathname)}${window.location.hash}`;

  if (currentUrl !== targetUrl) {
    window.history.pushState({ route }, '', targetUrl);
  }

  window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT));

  if (cleanHash) {
    scrollToSectionId(cleanHash);
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

export function useAppRoute(): {
  route: AppRoute;
  navigate: (route: AppRoute, sectionHash?: string) => void;
} {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromLocation());

  useEffect(() => {
    const syncRoute = () => {
      setRoute(getRouteFromLocation());
    };

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener(ROUTE_CHANGE_EVENT, syncRoute);

    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener(ROUTE_CHANGE_EVENT, syncRoute);
    };
  }, []);

  const navigate = useCallback((nextRoute: AppRoute, sectionHash?: string) => {
    navigateTo(nextRoute, sectionHash);
  }, []);

  return { route, navigate };
}

