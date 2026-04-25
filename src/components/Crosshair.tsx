import { useEffect, useState, RefObject } from 'react';
import { P } from '../palette';

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function Crosshair({ containerRef }: Props) {
  const [pos, setPos] = useState({ x: -100, y: -100, active: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top, active: true });
    };
    const onLeave = () => setPos((p) => ({ ...p, active: false }));
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  if (!pos.active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50, opacity: 0.6 }}>
      <div style={{
        position: 'absolute', top: pos.y, left: 0, right: 0, height: 1,
        background: P.accentDim, opacity: 0.4,
      }} />
      <div style={{
        position: 'absolute', left: pos.x, top: 0, bottom: 0, width: 1,
        background: P.accentDim, opacity: 0.4,
      }} />
      <div style={{
        position: 'absolute', top: pos.y - 9, left: pos.x - 9,
        width: 18, height: 18, border: `1px solid ${P.accent}`,
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', top: pos.y - 1, left: pos.x - 1,
        width: 2, height: 2, background: P.accent,
      }} />
    </div>
  );
}
