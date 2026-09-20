"use client";

import { useEffect, useState } from "react";

export function useHydrated() {
  // eslint-disable-next-line
  const [hydrated, setHydrated] = useState(
    useWishlistStore.persist.hasHydrated(),
  );
  
  useEffect(() => {
    const unsub = useWishlistStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  
    return unsub;
  }, []);
}