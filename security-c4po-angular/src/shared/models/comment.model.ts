import {v4 as UUID} from 'uuid';

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

export function transformCommentToRequestBody(comment: CommentDialogBody | Comment): Comment {
  const transformedComment = {
    ...comment,
    title: comment.title,
    description: comment.description,
    // Transforms related findings from RelatedFindingOption to list of finding ids
    relatedFindings: comment.relatedFindings ? comment.relatedFindings.map(finding => finding.value.id) : [],
    /* Remove Table Entry Object Properties */
    childEntries: undefined,
    kind: undefined,
    findings: undefined,
    expanded: undefined,
  } as unknown as Comment;
  return transformedComment;
}

export interface CommentDialogBody {
  title: string;
  description: string;
  relatedFindings: Array<RelatedFindingOption>;
}

export interface RelatedFindingOption {
  id: string;
  title: string;
}
