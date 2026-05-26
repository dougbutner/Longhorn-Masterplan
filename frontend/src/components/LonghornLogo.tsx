import { useCallback, useEffect, useRef, useState } from "react";
import { HORN_SRC } from "../lib/logo";
const WOBBLE_MS = 550;
const PAUSE_MS = 3000;

interface Props {
  className?: string;
  alt?: string;
}

export function LonghornLogo({ className = "", alt = "Longhorn" }: Props) {
  const [wobble, setWobble] = useState(false);
  const hovering = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }, []);

  const scheduleWobble = useCallback(() => {
    if (!hovering.current) return;
    setWobble(true);
    const end = setTimeout(() => {
      setWobble(false);
      if (!hovering.current) return;
      const next = setTimeout(() => scheduleWobble(), PAUSE_MS);
      timers.current.push(next);
    }, WOBBLE_MS);
    timers.current.push(end);
  }, []);

  const onEnter = useCallback(() => {
    hovering.current = true;
    clearTimers();
    scheduleWobble();
  }, [clearTimers, scheduleWobble]);

  const onLeave = useCallback(() => {
    hovering.current = false;
    clearTimers();
    setWobble(false);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <img
      src={HORN_SRC}
      alt={alt}
      width={28}
      height={28}
      draggable={false}
      className={`lh-logo shrink-0 select-none object-contain ${wobble ? "lh-logo--wobble" : ""} ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    />
  );
}

export { HORN_SRC } from "../lib/logo";
