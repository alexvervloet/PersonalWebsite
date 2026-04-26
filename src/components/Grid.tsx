import { useEffect, useRef } from 'react';

const SPACING = 28;
const RADIUS = 1.1;
const INFLUENCE = 140;
const PAD = INFLUENCE + 4;

function gridPointsInRect(
  x0: number, y0: number, x1: number, y1: number,
  maxW: number, maxH: number,
): [number, number][] {
  const pts: [number, number][] = [];
  const gx0 = Math.floor(x0 / SPACING) * SPACING;
  const gy0 = Math.floor(y0 / SPACING) * SPACING;
  for (let gx = gx0; gx <= x1 + SPACING; gx += SPACING) {
    for (let gy = gy0; gy <= y1 + SPACING; gy += SPACING) {
      if (gx >= SPACING && gy >= SPACING && gx < maxW && gy < maxH) {
        pts.push([gx, gy]);
      }
    }
  }
  return pts;
}

export function Grid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let ctx = canvas.getContext('2d')!;

    const mouse = { x: -9999, y: -9999 };
    const prev = { x: -9999, y: -9999 };
    let dirty = false;

    const drawStatic = () => {
      ctx.fillStyle = 'rgba(127, 184, 168, 0.14)';
      for (let x = SPACING; x < width + SPACING; x += SPACING) {
        for (let y = SPACING; y < height + SPACING; y += SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      drawStatic();
      prev.x = -9999;
      prev.y = -9999;
      dirty = false;
    };

    setup();

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; dirty = true; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; dirty = true; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', setup);

    let raf: number;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!dirty) return;
      dirty = false;

      // Restore previous influence area to static dots
      if (prev.x > -9000) {
        const x0 = prev.x - PAD, y0 = prev.y - PAD;
        const x1 = prev.x + PAD, y1 = prev.y + PAD;
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        ctx.fillStyle = 'rgba(127, 184, 168, 0.14)';
        for (const [gx, gy] of gridPointsInRect(x0, y0, x1, y1, width + SPACING, height + SPACING)) {
          ctx.beginPath();
          ctx.arc(gx, gy, RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw boosted dots around current mouse
      if (mouse.x > -9000) {
        const x0 = mouse.x - PAD, y0 = mouse.y - PAD;
        const x1 = mouse.x + PAD, y1 = mouse.y + PAD;
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        for (const [gx, gy] of gridPointsInRect(x0, y0, x1, y1, width + SPACING, height + SPACING)) {
          const dx = gx - mouse.x;
          const dy = gy - mouse.y;
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

      prev.x = mouse.x;
      prev.y = mouse.y;
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
