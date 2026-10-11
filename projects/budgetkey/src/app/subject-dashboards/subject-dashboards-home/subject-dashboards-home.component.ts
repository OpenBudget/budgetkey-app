import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { PlatformService } from '../../common-components/platform.service';
import { SubjectDashboardIndexEntry } from '../subject-dashboards.models';

interface SubjectDashboardTreeNode {
  name: string;
  isLeaf: boolean;
  slug?: string;
  slugSegments?: string[];
  updated?: string;
  children: SubjectDashboardTreeNode[];
}

function buildDashboardTree(entries: SubjectDashboardIndexEntry[]): SubjectDashboardTreeNode[] {
  const root: SubjectDashboardTreeNode[] = [];

  for (const entry of entries) {
    const segments = entry.slug.split('/');
    let siblings = root;

    segments.forEach((segment, index) => {
      const isLastSegment = index === segments.length - 1;

      if (isLastSegment) {
        siblings.push({ name: entry.title, isLeaf: true, slug: entry.slug, slugSegments: segments, updated: entry.updated, children: [] });
        return;
      }

      let folder = siblings.find((node) => !node.isLeaf && node.name === segment);
      if (!folder) {
        folder = { name: segment, isLeaf: false, children: [] };
        siblings.push(folder);
      }
      siblings = folder.children;
    });
  }

  return root;
}

@Component({
    selector: 'app-subject-dashboards-home',
    templateUrl: './subject-dashboards-home.component.html',
    styleUrls: ['./subject-dashboards-home.component.less'],
    standalone: false
})
export class SubjectDashboardsHomeComponent {
  tree: SubjectDashboardTreeNode[] = [];

  constructor(private http: HttpClient, private ps: PlatformService) {
    this.http.get<SubjectDashboardIndexEntry[]>(this.ps.BASE + '/assets/subject-dashboards/index.json')
      .subscribe((entries) => {
        this.tree = buildDashboardTree(entries);
      });
  }
}
