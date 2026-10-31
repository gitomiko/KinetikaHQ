import React from 'react';

/**
 * Button — Kinetika Design System
 *
 * Every value is bound to a design token (no hardcoded colors). The primary
 * variant reuses the system's own `.k-btn-primary` utility (AA-verified at
 * build time); the secondary variant is token-driven inline styles.
 *
 * Props:
 *   variant   'primary' | 'secondary'   (default 'primary')
 *   type      native button type        (default 'button')
 *   ...rest   spread onto <button> (onClick, disabled, aria-*, etc.)
 */
export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  style,
  children,
  ...rest
}) {
  if (variant === 'primary') {
    return (
      <button type={type} className={`k-btn-primary ${className}`.trim()} style={style} {...rest}>
        {children}
      </button>
    );
  }

  // secondary — transparent, strong border, secondary text (see design/README.md)
  const secondaryStyle = {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: 'var(--border-strong)',
    fontFamily: 'var(--btn-font)',
    fontSize: 'var(--btn-size)',
    fontWeight: 'var(--btn-weight)',
    letterSpacing: 'var(--btn-tracking)',
    padding: 'var(--btn-padding)',
    borderRadius: 'var(--btn-radius)',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'border-color var(--motion-transition), color var(--motion-transition)',
    ...style,
  };

  return (
    <button type={type} className={className} style={secondaryStyle} {...rest}>
      {children}
    </button>
  );
}

export default Button;
