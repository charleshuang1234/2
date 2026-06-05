"use client";

import { useEffect } from "react";

export function PwaClient() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installability should never block the app experience.
    });
  }, []);

  return null;
}
