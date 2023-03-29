import {Injectable} from '@angular/core';
import {NbDialogConfig, NbDialogService} from '@nebular/theme';
import {GenericDialogData} from '@shared/models/generic-dialog-data';
import {ComponentType} from '@angular/cdk/overlay';
import {Observable} from 'rxjs';
import {Validators} from '@angular/forms';
import {CommentDialogComponent} from '@shared/modules/comment-dialog/comment-dialog.component';
import {Comment} from '@shared/models/comment.model';
import {Pentest} from '@shared/models/pentest.model';

@Injectable()
export class CommentDialogService {

  constructor(private readonly dialog: NbDialogService) {
  }

  private readonly MIN_LENGTH: number = 4;

  static addDataToDialogConfig(
    dialogOptions?: Partial<NbDialogConfig<Partial<any> | string>>,
    commentData?: GenericDialogData
  ): Partial<NbDialogConfig<Partial<any> | string>> {
    return {
      context: {data: commentData},
      closeOnEsc: dialogOptions?.closeOnEsc || false,
      hasScroll: dialogOptions?.hasScroll || false,
      autoFocus: dialogOptions?.autoFocus || false,
      closeOnBackdropClick: dialogOptions?.closeOnBackdropClick || false
    };
  }

  public openCommentDialog(componentOrTemplateRef: ComponentType<any>,
                           findingIds: string[],
                           comment?: Comment,
                           config?: Partial<NbDialogConfig<Partial<any> | string>>,
                           pentestInfo?: Pentest): Observable<any> {
    let dialogOptions: Partial<NbDialogConfig<Partial<any> | string>>;
    let dialogData: GenericDialogData;
    // Preselect attachments
    const attachments: string[] = [];
    /* ToDo: Use after file upload is implemented
    if (comment && comment.attachments.length > 0) {
      comment.attachments.forEach(attachment => {
        // Load attachment to show
      });
    }*/
    // Setup CommentDialogBody
    dialogData = {
      form: {
        commentTitle: {
          fieldName: 'commentTitle',
          type: 'formText',
          labelKey: 'comment.title.label',
          placeholder: 'comment.title',
          controlsConfig: [
            {value: comment ? comment.title : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'comment.validationMessage.titleRequired'}
          ]
        },
        commentDescription: {
          fieldName: 'commentDescription',
          type: 'formText',
          labelKey: 'comment.description.label',
          placeholder: 'comment.description',
          controlsConfig: [
            {value: comment ? comment.description : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'comment.validationMessage.descriptionRequired'}
          ]
        }
      },
      options: []
    };
    if (comment) {
      dialogData.options = [
        {
          headerLabelKey: 'comment.edit.header',
          buttonKey: 'global.action.update',
          accentColor: 'warning',
          additionalData: comment
        },
      ];
    } else {
      dialogData.options = [
        {
          headerLabelKey: 'comment.create.header',
          buttonKey: 'global.action.save',
          accentColor: 'info',
          additionalData: pentestInfo
        },
      ];
    }
    // Merge dialog config with finding data
    dialogOptions = CommentDialogService.addDataToDialogConfig(config, dialogData);
    return this.dialog.open(CommentDialogComponent, dialogOptions).onClose;
  }
}
