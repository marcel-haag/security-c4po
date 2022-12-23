import {CommentDialogService} from '@shared/modules/comment-dialog/service/comment-dialog.service';
import {ComponentType} from '@angular/cdk/overlay';
import {NbDialogConfig} from '@nebular/theme';
import {Observable, of} from 'rxjs';
import {Comment, RelatedFindingOption} from '@shared/models/comment.model';

export class CommentDialogServiceMock implements Required<CommentDialogService> {

  dialog: any;

  openCommentDialog(
    componentOrTemplateRef: ComponentType<any>,
    findingIds: [],
    relatedFindings: RelatedFindingOption[],
    comment: Comment | undefined,
    config: Partial<NbDialogConfig<Partial<any> | string>> | undefined): Observable<any> {
    return of(undefined);
  }
}
