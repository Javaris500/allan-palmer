"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onDone?: () => void;
  cursor?: boolean;
  className?: string;
}

export function Typewriter({
  text,
  speed = 28,
  delay = 0,
  onDone,
  cursor = true,
  className,
}: TypewriterProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown("");
    setDone(false);
    const start = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
          onDone?.();
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={className}>
      {shown}
      {cursor && !done && (
        <span
          aria-hidden
          className="inline-block w-[2px] h-[1em] align-[-0.15em] ml-[1px] bg-gold animate-pulse"
        />
      )}
    </span>
  );
}
