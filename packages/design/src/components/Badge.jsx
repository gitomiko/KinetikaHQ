import React from 'react';

/**
 * Badge — Kinetika Design System
 *
 * Renders the system's token-driven `.k-badge-*` utility. Every family is
 * AA-verified at build time (text ≥ 4.5:1 on its badge background).
 *
 * Props:
 *   variant   'patina' | 'verdigris' | 'azure' | 'teal' | 'amethyst' | 'garnet'
 *             (default 'patina')
 *   ...rest   spread onto <span>
 */
export const BADGE_VARIANTS = ['patina', 'verdigris', 'azure', 'teal', 'amethyst', 'garnet'];

export function Badge({ variant = 'patina', className = '', children, ...rest }) {
  const v = BADGE_VARIANTS.includes(variant) ? variant : 'patina';
  return (
    <span className={`k-badge-${v} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}

export default Badge;
