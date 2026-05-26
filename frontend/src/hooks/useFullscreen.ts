import { useCallback, useEffect, useState } from "react";

export function useFullscreen<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFull(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [ref]);

  const toggle = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenElement === el) await document.exitFullscreen();
    else await el.requestFullscreen();
  }, [ref]);

  return { isFull, toggle };
}
