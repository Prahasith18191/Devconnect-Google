import React, { useRef } from 'react';

/**
 * A pill button that magnetically tracks the cursor when hovered (spring translate)
 * and lifts/scales on hover — Antigravity's primary-CTA micro-interaction.
 */
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
}

export const MagneticButton: React.FC<Props> = ({ strength = 0.3, className = '', children, ...rest }) => {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${mx * strength}px, ${my * strength}px) scale(1.04)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`${className} will-change-transform`}
      style={{ transition: 'transform 0.25s cubic-bezier(0.25,1,0.5,1), box-shadow 0.25s cubic-bezier(0.25,1,0.5,1)' }}
      {...rest}
    >
      {children}
    </button>
  );
};
