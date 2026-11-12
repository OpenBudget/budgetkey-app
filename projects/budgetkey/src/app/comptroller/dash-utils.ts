import { Comptroller } from './comptroller-dash.service';

// Formatting helpers shared by the landing page's sections

export function num(value: number | null | undefined): string {
  return (value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function pct(share: number | null | undefined): string {
  return Math.round((share || 0) * 100) + '%';
}

export function year(date: string | null | undefined): string {
  return (date || '').slice(0, 4);
}

// "מיכה לינדנשטראוס" -> "לינדנשטראוס"
export function surname(c: Comptroller): string {
  return c.name.split(' ').slice(-1)[0];
}

// The tables link to the live site; inside the app the same pages are relative
export function sitePath(url: string | null | undefined): string {
  return (url || '').replace(/^https?:\/\/next\.obudget\.org/, '');
}

// The page's time axis, as fractions of the period since 2000 (shared by the issue ribbons)
export const AXIS_START = Date.UTC(2000, 0, 1);
export const AXIS_END = Date.UTC(2027, 0, 1);

export function axisPos(date: string | null | undefined): number {
  const t = date ? Date.parse(date) : AXIS_END;
  return Math.min(1, Math.max(0, (t - AXIS_START) / (AXIS_END - AXIS_START)));
}
