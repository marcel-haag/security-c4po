import {v4 as UUID} from 'uuid';
import {Severity} from '@shared/models/severity.enum';

export class Comment {
  id?: string;
  title: string;
  description?: string;
  relatedFindings?: Array<string>;

  constructor(title: string,
              description: string,
              id?: string,
              relatedFindings?: Array<string>) {
    this.id = id ? id : UUID();
    this.title = title;
    this.description = description;
    this.relatedFindings = relatedFindings;
  }
}

export interface CommentEntry {
  commentId: string;
  title: string;
  description: string;
  relatedFindings: Array<string>;
  kind?: string;
  childEntries?: [];
  expanded?: boolean;
}

export function transformCommentsToObjectiveEntries(findings: Comment[]): CommentEntry[] {
  const findingEntries: CommentEntry[] = [];
  findings.forEach((value: Comment) => {
    findingEntries.push({
      commentId: value.id,
      title: value.title,
      description: value.description,
      relatedFindings: value.relatedFindings,
      kind: 'cell',
      childEntries: null,
      expanded: false
    } as CommentEntry);
  });
  return findingEntries;
}
