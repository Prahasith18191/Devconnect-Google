import React from 'react';

/**
 * Splits text into per-character spans with a staggered fade/float-up entrance and a
 * per-letter hover lift — the Antigravity "kinetic typography" effect. Words never break
 * across lines (each word is an inline-block group).
 */
export const KineticText: React.FC<{ text: string; className?: string; stagger?: number; delay?: number }> = ({
  text, className = '', stagger = 0.02, delay = 0,
}) => {
  const words = text.split(' ');
  let idx = 0;
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {word.split('').map((ch, ci) => {
            const d = delay + idx * stagger; idx += 1;
            return (
              <span key={ci} className="ag-kinetic-char" style={{ animationDelay: `${d}s` }}>{ch}</span>
            );
          })}
          {wi < words.length - 1 && <span className="ag-kinetic-char" style={{ animationDelay: `${(idx++) * stagger + delay}s` }}>{' '}</span>}
        </span>
      ))}
    </span>
  );
};
