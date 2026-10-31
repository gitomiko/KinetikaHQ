/**
 * Kinetika Design System — React component entry.
 *
 * Tokens (design/tokens.json → tokens.css) are the framework-neutral source of
 * truth. These React components are the first consumer; they bind every value
 * to a token. Load `kinetika/tokens.css` once on the page so the variables exist.
 *
 * For Claude Design / script-tag use, every component is also registered on
 * `window.Kinetika` so an agent can render and compose them.
 */
import { Button } from './components/Button.jsx';
import { Badge, BADGE_VARIANTS } from './components/Badge.jsx';
import { Card } from './components/Card.jsx';

export { Button, Badge, Card, BADGE_VARIANTS };

if (typeof window !== 'undefined') {
  window.Kinetika = Object.assign({}, window.Kinetika, { Button, Badge, Card });
}
