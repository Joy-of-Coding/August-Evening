import { useEffect, useState } from 'react';

export function useLocalStorageList(key: string, initial: string[]) {
  const [list, setList] = useState<string[]>(initial);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setList(parsed);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
  }, [key, list]);

  return [list, setList] as const;
}

