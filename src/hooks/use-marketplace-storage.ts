import { useCallback, useEffect, useState } from "react";

function useLocalStorageList(key: string, max = 50) {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setList(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [key]);

  const persist = useCallback(
    (next: string[]) => {
      const trimmed = next.slice(0, max);
      setList(trimmed);
      try {
        localStorage.setItem(key, JSON.stringify(trimmed));
      } catch {
        // ignore
      }
    },
    [key, max]
  );

  return [list, persist] as const;
}

const FAV_KEY = "evena.marketplace.favorites";
const RECENT_KEY = "evena.marketplace.recent";

export function useFavorites() {
  const [favs, setFavs] = useLocalStorageList(FAV_KEY, 200);
  const isFav = useCallback((id: string) => favs.includes(id), [favs]);
  const toggle = useCallback(
    (id: string) => {
      setFavs(favs.includes(id) ? favs.filter((x) => x !== id) : [id, ...favs]);
    },
    [favs, setFavs]
  );
  return { favs, isFav, toggle };
}

export function useRecents() {
  const [recents, setRecents] = useLocalStorageList(RECENT_KEY, 24);
  const push = useCallback(
    (id: string) => {
      setRecents([id, ...recents.filter((x) => x !== id)]);
    },
    [recents, setRecents]
  );
  return { recents, push };
}
