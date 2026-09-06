import { useState } from 'react';
import { P } from '../palette';

const CORNERS = [
  { top: 8, left: 8 },
  { top: 8, right: 8 },
  { bottom: 8, left: 8 },
  { bottom: 8, right: 8 },
] as const;

type Corner = typeof CORNERS[number];

function cornerBorder(c: Corner) {
  return {
    borderTop: 'top' in c ? `1px solid ${P.accent}` : 'none',
    borderBottom: 'bottom' in c ? `1px solid ${P.accent}` : 'none',
    borderLeft: 'left' in c ? `1px solid ${P.accent}` : 'none',
    borderRight: 'right' in c ? `1px solid ${P.accent}` : 'none',
  };
}

// Widths match scripts/build-images.mjs. 664 is 1x desktop, 1328 covers the
// 447px column at DPR 2, 1660 covers a full-bleed DPR 3 phone.
const WIDTHS = [664, 1328, 1660];
const srcset = (ext: string) =>
  WIDTHS.map((w) => `/portrait-${w}.${ext} ${w}w`).join(', ');

// Below 768 the hero collapses to one column and the portrait goes full-bleed
// inside 24px of padding. Between 768 and the 1240 container cap the column is
// (100vw - 168) / 2.4. Past that it is a flat 447px.
const SIZES =
  '(max-width: 767px) calc(100vw - 48px), ' +
  '(max-width: 1240px) calc(41.67vw - 70px), ' +
  '447px';

export function Portrait() {
  // Only tracks an outright load failure. The image is never opacity-gated on
  // a load handler: Chrome skips zero-opacity elements as LCP candidates, so
  // fading in on onLoad pushed LCP out past hydration. React also does not
  // replay load events that fired before hydration, so a cached load used to
  // leave the placeholder up permanently.
  const [errored, setErrored] = useState(false);

  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '3 / 4',
      background: P.panel, border: `1px solid ${P.line}`,
      overflow: 'hidden',
    }}>
      {/* Stripes sit under the photo rather than swapping with it, so there is
          nothing to toggle and a failed load still lands on something. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(
          135deg,
          ${P.panel} 0 14px,
          ${P.bgAlt} 14px 28px
        )`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${P.accent}22, transparent 70%)`,
      }} />

      {!errored && (
        <picture>
          <source type="image/webp" srcSet={srcset('webp')} sizes={SIZES} />
          <img
            src="/portrait.duotone.jpeg"
            srcSet={srcset('jpeg')}
            sizes={SIZES}
            alt="Alexander Vervloet"
            width={1328}
            height={1200}
            // react-dom 18.3.1 does not know fetchPriority, so it passes the
            // camelCase spelling straight through and warns on every render.
            // Spreading the lowercase attribute renders it cleanly and still
            // typechecks.
            {...{ fetchpriority: 'high' }}
            decoding="async"
            onError={() => setErrored(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
            }}
          />
        </picture>
      )}

      {/* Duotone colour grade, layered over whatever rendered above. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${P.accent}44, transparent 70%)`,
        mixBlendMode: 'color',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 55%, ${P.bg}bb 100%)`,
        pointerEvents: 'none',
      }} />

      {errored && (
        <div style={{
          position: 'absolute', left: 12, bottom: 12,
          fontSize: 9, letterSpacing: '0.18em', color: P.dim,
          fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase',
        }}>
          portrait.duotone<br />
          <span style={{ color: P.mute }}>image unavailable</span>
        </div>
      )}

      {CORNERS.map((c, i) => (
        <div key={i} style={{ position: 'absolute', ...c, width: 14, height: 14, ...cornerBorder(c), pointerEvents: 'none' }} />
      ))}
    </div>
  );
}
