import { useEffect, useRef, RefObject } from 'react';

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
}

const SPACING = 28;
const RADIUS = 1.1;
const INFLUENCE = 140;
const PAD = INFLUENCE + 4;

function gridPointsInRect(
  x0: number, y0: number, x1: number, y1: number,
  width: number, height: number,
): [number, number][] {
  const pts: [number, number][] = [];
  const gx0 = Math.floor(x0 / SPACING) * SPACING;
  const gy0 = Math.floor(y0 / SPACING) * SPACING;
  for (let gx = gx0; gx <= x1 + SPACING; gx += SPACING) {
    for (let gy = gy0; gy <= y1 + SPACING; gy += SPACING) {
      if (gx >= SPACING && gy >= SPACING && gx < width && gy < height) {
        pts.push([gx, gy]);
      }
    }
  }
  return pts;
}

export function Grid({ containerRef, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const prevMouseRef = useRef({ x: -9999, y: -9999 });
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

    // Draw the full static grid once up front
    ctx.fillStyle = 'rgba(127, 184, 168, 0.14)';
    for (let x = SPACING; x < width; x += SPACING) {
      for (let y = SPACING; y < height; y += SPACING) {
        ctx.beginPath();
        ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }

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

      const prev = prevMouseRef.current;
      const curr = mouseRef.current;

      // Restore previous influence area to static dots
      if (prev.x > -9000) {
        const x0 = prev.x - PAD, y0 = prev.y - PAD;
        const x1 = prev.x + PAD, y1 = prev.y + PAD;
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        ctx.fillStyle = 'rgba(127, 184, 168, 0.14)';
        for (const [gx, gy] of gridPointsInRect(x0, y0, x1, y1, width, height)) {
          ctx.beginPath();
          ctx.arc(gx, gy, RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw boosted dots around current mouse position
      if (curr.x > -9000) {
        const x0 = curr.x - PAD, y0 = curr.y - PAD;
        const x1 = curr.x + PAD, y1 = curr.y + PAD;
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        for (const [gx, gy] of gridPointsInRect(x0, y0, x1, y1, width, height)) {
          const dx = gx - curr.x;
          const dy = gy - curr.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          let r = RADIUS, alpha = 0.14;
          if (d < INFLUENCE) {
            const t = 1 - d / INFLUENCE;
            r = RADIUS + t * 2.4;
            alpha = 0.14 + t * 0.55;
          }
          ctx.beginPath();
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(127, 184, 168, ${alpha})`;
          ctx.fill();
        }
      }

      prevMouseRef.current = { ...curr };
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
