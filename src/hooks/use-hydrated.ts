"use client";

import { useEffect, useState } from "react";

export function useHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, [hasHydrated]);

  return {
    hasHydrated,
  };
}