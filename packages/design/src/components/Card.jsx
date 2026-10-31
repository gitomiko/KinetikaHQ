import React from 'react';

/**
 * Card — Kinetika Design System
 *
 * Token-driven surface. The active state is carried by the border + top accent
 * (never background alone), per the design system's accessibility rule.
 *
 * Props:
 *   active    boolean   (default false)
 *   ...rest   spread onto <div>
 */
export function Card({ active = false, className = '', style, children, ...rest }) {
  const cardStyle = {
    background: active ? 'var(--card-active-bg)' : 'var(--card-bg)',
    border: active
      ? 'var(--border-width-default) solid var(--card-active-border)'
      : 'var(--card-border)',
    borderTop: active ? '2px solid var(--card-active-accent)' : undefined,
    borderRadius: 'var(--card-radius)',
    padding: 'var(--space-5)',
    color: 'var(--color-text-primary)',
    transition: 'border-color var(--motion-transition), background var(--motion-transition)',
    ...style,
  };

  return (
    <div className={className} style={cardStyle} {...rest}>
      {children}
    </div>
  );
}

export default Card;
