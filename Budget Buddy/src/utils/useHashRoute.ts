import { useEffect, useState } from 'react';

export function useHashRoute(defaultRoute: string = 'dashboard') {
  const [route, setRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || defaultRoute;
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      setRoute(hash || defaultRoute);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [defaultRoute]);

  const navigate = (to: string) => {
    if (!to.startsWith('#')) {
      window.location.hash = `#/${to}`;
    } else {
      window.location.hash = to;
    }
  };

  return { route, navigate } as const;
}


