"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useAdaptiveMotion() {
  const reducedMotion = useReducedMotion();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = () => setMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return {
    shouldReduce: reducedMotion || mobile,
    mobile
  };
}
