import { useEffect, useState } from "react";
import { HORN_SRC } from "./LonghornLogo";

/** Large horn peeking from the edge; parallax follows the cursor. */
export function LonghornAccent() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setOffset({ x: nx * 28, y: ny * 18 });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="lh-horn-accent pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <img src={HORN_SRC} alt="" className="lh-horn-accent__img" draggable={false} />
    </div>
  );
}
