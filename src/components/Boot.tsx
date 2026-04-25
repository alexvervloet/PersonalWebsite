import { useEffect, useState } from 'react';
import { P } from '../palette';

const BOOT_LINES = [
  { t: 'av-os v2.4.1 (mono)', delay: 60 },
  { t: 'Initializing runtime ................ [ ok ]', delay: 40 },
  { t: 'Loading profile: alexander.vervloet ... [ ok ]', delay: 40 },
  { t: 'Mounting /experience /skills /projects  [ ok ]', delay: 40 },
  { t: 'Resolving location: Taichung, TW · UTC+8', delay: 40 },
  { t: 'Availability status: open to remote roles', delay: 40 },
  { t: 'ready.', delay: 200 },
];

interface Props {
  onDone: () => void;
}

export function Boot({ onDone }: Props) {
  const [visible, setVisible] = useState<string[]>([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        await new Promise<void>((r) => setTimeout(r, BOOT_LINES[i].delay + (i === 0 ? 300 : 180)));
        if (cancelled) return;
        setVisible((v) => [...v, BOOT_LINES[i].t]);
      }
      await new Promise<void>((r) => setTimeout(r, 500));
      if (cancelled) return;
      setFading(true);
      await new Promise<void>((r) => setTimeout(r, 500));
      if (!cancelled) onDone();
    };
    run();
    return () => { cancelled = true; };
  }, [onDone]);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: P.bg, color: P.accent,
      padding: '40px 48px', fontSize: 12, lineHeight: 1.8,
      opacity: fading ? 0 : 1, transition: 'opacity 0.5s',
    }}>
      <div style={{ opacity: 0.5, marginBottom: 16, fontSize: 10, letterSpacing: '0.2em' }}>
        BOOT SEQUENCE
      </div>
      {visible.map((line, i) => (
        <div key={i} style={{ color: line.includes('[ ok ]') ? P.ink : P.accent }}>
          <span style={{ color: P.mute, marginRight: 12 }}>
            {String(i).padStart(2, '0')}
          </span>
          {line}
        </div>
      ))}
      {visible.length < BOOT_LINES.length && (
        <span style={{ color: P.accent }}>
          <span style={{ color: P.mute, marginRight: 12 }}>
            {String(visible.length).padStart(2, '0')}
          </span>
          <span className="cursor" />
        </span>
      )}
    </div>
  );
}
