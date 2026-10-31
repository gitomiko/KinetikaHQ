# Kinetika — Design Agent Conventions

## Wrapping and setup

No provider or root wrapper is needed. Components are self-contained: utility classes resolve from `_ds_bundle.css` (loaded via `styles.css`), and token-driven inline styles resolve from the same stylesheet's CSS custom properties. Fonts (Cormorant Garamond, Syne, DM Mono) load from Google Fonts via `styles.css`.

## Styling idiom

Kinetika uses **two complementary idioms** — utility classes for the few components that ship them, and CSS custom properties (`var(--*)`) for all composition and layout glue you author yourself:

**Utility classes (ship with components — use as-is, never invent new ones):**
| Class | Component |
|---|---|
| `.k-btn-primary` | Primary button — patina bg, ember text, tracked uppercase |
| `.k-badge-patina` | Badge — warm tan |
| `.k-badge-verdigris` | Badge — green |
| `.k-badge-azure` | Badge — blue |
| `.k-badge-teal` | Badge — teal |
| `.k-badge-amethyst` | Badge — lavender |
| `.k-badge-garnet` | Badge — rose |

**Token idiom for your own layout/typography:**
```css
/* Typography */
var(--font-display)    /* Cormorant Garamond — headings, display */
var(--font-interface)  /* Syne — labels, UI text */
var(--font-technical)  /* DM Mono — numerals, code, data */

/* Color */
var(--color-text-primary)   /* primary text */
var(--color-text-secondary) /* secondary/supporting text */
var(--color-text-tertiary)  /* ghost labels, metadata */

/* Spacing */
var(--space-1)  /* 4px */  var(--space-2)  /* 8px */
var(--space-3)  /* 12px */ var(--space-4)  /* 16px */
var(--space-5)  /* 20px */ var(--space-6)  /* 24px */

/* Tracking */
var(--tracking-widest) /* 0.18em — used for uppercase labels */
var(--tracking-wide)   /* 0.06em */

/* Radius */
var(--radius-sm)  /* 3px — buttons, badges */
var(--radius-md)  /* 6px — cards, inputs */
```

**Never use raw hex or hardcoded values** — every visual decision in Kinetika flows from tokens. The card background for dark/light mode switches automatically via `var(--card-bg)`.

## Where the truth lives

Read `_ds_bundle.css` (reached via `styles.css`) for the full token set (238 properties). Per-component API is in each `<Name>.d.ts` and usage notes in `<Name>.prompt.md`.

## Idiomatic build example

```jsx
import { Button, Badge, Card } from 'kinetika';

function AssetCard({ name, value, change, status, active }) {
  return (
    <Card active={active} style={{ width: 280 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 'var(--space-3)'
      }}>
        <span style={{
          fontFamily: 'var(--font-interface)',
          fontSize: '11px',
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)'
        }}>{name}</span>
        <Badge variant={status}>{status}</Badge>
      </div>
      <div style={{
        fontFamily: 'var(--font-technical)',
        fontSize: '22px',
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-1)'
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--font-interface)',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-4)'
      }}>{change}</div>
      <Button variant="primary">View Details</Button>
    </Card>
  );
}
```
