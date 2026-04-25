import { useEffect, useRef, RefObject } from 'react';

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
}

const SPACING = 28;
const RADIUS = 1.1;
const INFLUENCE = 140;

export function Grid({ containerRef, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dirtyRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      dirtyRef.current = true;
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      dirtyRef.current = true;
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    let raf: number;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!dirtyRef.current) return;
      dirtyRef.current = false;

      ctx.clearRect(0, 0, width, height);
      const { x: mx, y: my } = mouseRef.current;
      for (let x = SPACING; x < width; x += SPACING) {
        for (let y = SPACING; y < height; y += SPACING) {
          const dx = x - mx;
          const dy = y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          let r = RADIUS;
          let alpha = 0.14;
          if (d < INFLUENCE) {
            const t = 1 - d / INFLUENCE;
            r = RADIUS + t * 2.4;
            alpha = 0.14 + t * 0.55;
          }
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(127, 184, 168, ${alpha})`;
          ctx.fill();
        }
      }
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
