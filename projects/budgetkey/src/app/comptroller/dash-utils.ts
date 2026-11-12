import { Axis, Comptroller } from './comptroller-dash.service';

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

const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

// "1999-03-15" -> "מרץ 1999"
export function monthYear(date: string | null | undefined): string {
  return date ? `${MONTHS[+date.slice(5, 7) - 1]} ${year(date)}` : '';
}

// The span between two dates, as briefly as it goes: "מרץ 1999", "ינואר–מרץ 2006", "ספטמבר 2020 – מאי 2024"
export function monthSpan(from: string | null | undefined, to: string | null | undefined): string {
  if (!to || monthYear(from) === monthYear(to)) {
    return monthYear(from);
  }
  if (year(from) === year(to)) {
    return `${MONTHS[+from!.slice(5, 7) - 1]}–${monthYear(to)}`;
  }
  return `${monthYear(from)} – ${monthYear(to)}`;
}

// "מיכה לינדנשטראוס" -> "לינדנשטראוס"
export function surname(c: Comptroller): string {
  return c.name.split(' ').slice(-1)[0];
}

// "2005–2012"; a comptroller whose term ended without a successor has no end date, only a last year
export function termYears(c: Comptroller): string {
  return `${year(c.start_date)}–${c.end_date ? year(c.end_date) : c.last_year}`;
}

// The tables link to the live site; inside the app the same pages are relative
export function sitePath(url: string | null | undefined): string {
  return (url || '').replace(/^https?:\/\/next\.obudget\.org/, '');
}

// The first year the data covers: the first report of the earliest comptroller
export function startYear(comptrollers: Comptroller[]): number | null {
  return comptrollers.length ? Math.min(...comptrollers.map((c) => c.first_year)) : null;
}

// A time axis over the years the data covers, as fractions of the period (used by the issue ribbons);
// a date outside it is clamped to its ends, and a missing date means "still going"
export function timeAxis(comptrollers: Comptroller[]): (date: string | null | undefined) => number {
  const first = startYear(comptrollers) || 2000;
  const last = comptrollers.length ? Math.max(...comptrollers.map((c) => c.last_year)) : new Date().getFullYear();
  const start = Date.UTC(first, 0, 1);
  const end = Date.UTC(last + 1, 0, 1);
  return (date) => {
    const t = date ? Date.parse(date) : end;
    return Math.min(1, Math.max(0, (t - start) / (end - start)));
  };
}

// The two classifications, in the same order wherever there's a switch between them
export const AXES: {key: Axis, label: string}[] = [
  {key: 'domain', label: 'תחומים'},
  {key: 'lens', label: 'סוגי בעיות'},
];
