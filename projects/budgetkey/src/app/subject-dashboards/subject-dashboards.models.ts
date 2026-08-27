export interface SubjectDashboardMeta {
  title: string;
  created: string;
  updated: string;
  model: string;
  path: string;
}

export interface SubjectDashboardIndexEntry extends SubjectDashboardMeta {
  slug: string;
}
