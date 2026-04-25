import { useEffect, useRef, RefObject } from 'react';
import { P } from '../palette';

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function Crosshair({ containerRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      wrap.style.opacity = '1';
      if (hLineRef.current) hLineRef.current.style.top = `${y}px`;
      if (vLineRef.current) vLineRef.current.style.left = `${x}px`;
      if (ringRef.current) {
        ringRef.current.style.top = `${y - 9}px`;
        ringRef.current.style.left = `${x - 9}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.top = `${y - 1}px`;
        dotRef.current.style.left = `${x - 1}px`;
      }
    };
    const onLeave = () => { wrap.style.opacity = '0'; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50, opacity: 0 }}>
      <div ref={hLineRef} style={{
        position: 'absolute', top: -9999, left: 0, right: 0, height: 1,
        background: P.accentDim, opacity: 0.4,
      }} />
      <div ref={vLineRef} style={{
        position: 'absolute', left: -9999, top: 0, bottom: 0, width: 1,
        background: P.accentDim, opacity: 0.4,
      }} />
      <div ref={ringRef} style={{
        position: 'absolute', top: -9999, left: -9999,
        width: 18, height: 18, border: `1px solid ${P.accent}`,
        borderRadius: '50%',
      }} />
      <div ref={dotRef} style={{
        position: 'absolute', top: -9999, left: -9999,
        width: 2, height: 2, background: P.accent,
      }} />
    </div>
  );
}
