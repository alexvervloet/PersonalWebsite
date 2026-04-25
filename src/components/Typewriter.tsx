import { useEffect, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  onDone?: () => void;
}

export function Typewriter({ text, speed = 24, startDelay = 0, showCursor = true, onDone }: Props) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const tick = () => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          setDone(true);
          onDone?.();
        } else {
          timeout = setTimeout(tick, speed);
        }
      };
      tick();
    }, startDelay);
    return () => { clearTimeout(start); clearTimeout(timeout); };
  }, [text, speed, startDelay, onDone]);

  return (
    <span>
      {out}
      {showCursor && !done && <span className="cursor" />}
    </span>
  );
}
