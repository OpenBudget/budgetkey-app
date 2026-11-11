// Hebrew labels for the State Comptroller audit and issue fields, used by their item pages and search results

export const PUBLICATION_TYPES: {[type: string]: string} = {
  annual: 'דוח שנתי',
  special: 'דוח מיוחד',
};

export const FINDING_TYPES: {[type: string]: string} = {
  deficiency: 'ליקוי',
  positive: 'ממצא חיובי',
  observation: 'הערה',
};

export const SEVERITIES: {[severity: string]: string} = {
  high: 'חומרה גבוהה',
  medium: 'חומרה בינונית',
  low: 'חומרה נמוכה',
};

export const FOLLOW_UP_KINDS: {[kind: string]: string} = {
  follow_up_audit: 'ביקורת מעקב',
  includes_follow_up: 'כולל מעקב אחר ממצאים קודמים',
};

// Rectification status, from follow-up audits and from the government's responses.
// `tone` colours the badge as a traffic light.
export interface Status {
  label: string;
  tone: 'good' | 'fair' | 'poor' | 'bad' | 'neutral';
}

export const STATUSES: {[status: string]: Status} = {
  rectified: {label: 'תוקן', tone: 'good'},
  mostly_rectified: {label: 'תוקן במידה רבה', tone: 'fair'},
  partially_rectified: {label: 'תוקן חלקית', tone: 'poor'},
  not_rectified: {label: 'לא תוקן', tone: 'bad'},
  in_progress: {label: 'בטיפול', tone: 'neutral'},
  disputed: {label: 'הגוף חולק על הממצא', tone: 'bad'},
};

export function status(value: string | null | undefined): Status | null {
  return (value && STATUSES[value]) || null;
}
