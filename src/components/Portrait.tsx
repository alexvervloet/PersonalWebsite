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

export function Portrait() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const showPhoto = loaded && !errored;

  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '3 / 4',
      background: P.panel, border: `1px solid ${P.line}`,
      overflow: 'hidden',
    }}>
      {/* Attempt to load the photo from /portrait.duotone.jpg in public/ */}
      <img
        src="/portrait.duotone.jpeg"
        alt="Alexander Vervloet"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
          opacity: showPhoto ? 1 : 0,
          transition: 'opacity 0.4s',
        }}
      />

      {/* Duotone colour overlay — visible when photo is loaded */}
      {showPhoto && (
        <>
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
        </>
      )}

      {/* Stripe placeholder — shown while no photo */}
      {!showPhoto && (
        <>
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
          <div style={{
            position: 'absolute', left: 12, bottom: 12,
            fontSize: 9, letterSpacing: '0.18em', color: P.dim,
            fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase',
          }}>
            portrait.duotone<br />
            <span style={{ color: P.mute }}>drop /portrait.duotone.jpg in public/</span>
          </div>
        </>
      )}

      {/* Corner brackets — always */}
      {CORNERS.map((c, i) => (
        <div key={i} style={{ position: 'absolute', ...c, width: 14, height: 14, ...cornerBorder(c), pointerEvents: 'none' }} />
      ))}
    </div>
  );
}
