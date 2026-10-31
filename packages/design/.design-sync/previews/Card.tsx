import { Card } from 'kinetika';

export const Default = () => (
  <Card style={{ width: 280 }}>
    <div style={{ marginBottom: 'var(--space-2)', fontFamily: 'var(--font-interface)', fontSize: '11px', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Portfolio</div>
    <div style={{ fontFamily: 'var(--font-technical)', fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>$124,880</div>
    <div style={{ fontFamily: 'var(--font-interface)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>+2.4% this week</div>
  </Card>
);

export const Active = () => (
  <Card active style={{ width: 280 }}>
    <div style={{ marginBottom: 'var(--space-2)', fontFamily: 'var(--font-interface)', fontSize: '11px', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Selected</div>
    <div style={{ fontFamily: 'var(--font-technical)', fontSize: '24px', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>$88,420</div>
    <div style={{ fontFamily: 'var(--font-interface)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>+1.1% this week</div>
  </Card>
);
