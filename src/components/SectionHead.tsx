import { ReactNode } from 'react';
import { P } from '../palette';

interface Props {
  num: string;
  label: string;
  title: ReactNode;
}

export function SectionHead({ num, label, title }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 14,
        color: P.accent, fontSize: 10, letterSpacing: '0.22em',
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        <span style={{ color: P.mute }}>{num}</span>
        <span>// {label}</span>
        <span style={{ flex: 1, height: 1, background: P.line, opacity: 0.6 }} />
      </div>
      <h2 className="sans" style={{
        fontSize: 28, fontWeight: 500, margin: 0, color: P.ink,
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
    </div>
  );
}
