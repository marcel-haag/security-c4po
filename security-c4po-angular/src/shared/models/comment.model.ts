import {v4 as UUID} from 'uuid';

export class Comment {
  id?: string;
  title: string;
  description?: string;
  // List of attachment id's for file upload
  attachments?: Array<string>;

  constructor(title: string,
              description: string,
              id?: string,
              attachments?: Array<string>) {
    this.id = id ? id : UUID();
    this.title = title;
    this.description = description;
    this.attachments = attachments;
  }
}

export interface CommentEntry {
  commentId: string;
  title: string;
  description: string;
  attachments: Array<string>;
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
      attachments: value.attachments,
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
    attachments: comment.attachments,
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
  attachments: Array<string>;
}

