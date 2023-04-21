import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericDialogData, GenericFormFieldConfig} from '@shared/models/generic-dialog-data';
import * as FA from '@fortawesome/free-solid-svg-icons';
import deepEqual from 'deep-equal';
import {NB_DIALOG_CONFIG, NbDialogRef} from '@nebular/theme';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Comment, transformCommentToRequestBody} from '@shared/models/comment.model';
import {UpdatePentestComments} from '@shared/stores/project-state/project-state.actions';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {Store} from '@ngxs/store';
import {CommentService} from '@shared/services/api/comment.service';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class CommentDialogComponent implements OnInit {
  // form control elements
  commentFormGroup: FormGroup;
  formArray: GenericFormFieldConfig[];

  dialogData: GenericDialogData;

  // HTML only
  readonly fa = FA;
  readonly getRowsFromString = /\r|\r\n|\n/;

  constructor(
    @Inject(NB_DIALOG_CONFIG) private data: GenericDialogData,
    private fb: FormBuilder,
    protected dialogRef: NbDialogRef<CommentDialogComponent>,
    private commentService: CommentService,
    private readonly notificationService: NotificationService,
    private dialogService: DialogService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.dialogData = this.data;
    this.commentFormGroup = this.generateFormCreationFieldArray();
  }

  generateFormCreationFieldArray(): FormGroup {
    this.formArray = Object.values(this.data.form);
    const config = this.formArray?.reduce((accumulator: {}, currentValue: GenericFormFieldConfig) => ({
      ...accumulator,
      [currentValue?.fieldName]: currentValue?.controlsConfig
    }), {});
    return this.fb.group(config);
  }

  changeAttachments($event): void {
    // tslint:disable-next-line:no-string-literal
    // this.commentFormGroup.controls['commentAttachments'].value;
  }

  onClickSave(value: any): void {
    if (this.dialogData.options[0].headerLabelKey.includes('create')) {
      // Save
      this.saveComment(value);
    } else {
      // Update
      this.updateComment(value);
    }
  }

  onClickClose(): void {
    this.dialogRef.close();
  }

  allowSave(): boolean {
    return this.commentFormGroup.valid && this.commentDataChanged();
  }

  /**
   * @return true if comment data is different from initial value
   */
  private commentDataChanged(): boolean {
    const oldCommentData = this.parseInitializedCommentDialogData(this.dialogData);
    const newCommentData = this.commentFormGroup.getRawValue();
    Object.entries(newCommentData).forEach(entry => {
      const [key, value] = entry;
    });
    const didChange = !deepEqual(oldCommentData, newCommentData);
    return didChange;
  }

  /**
   * @param dialogData of type GenericDialogData
   * @return parsed findingData
   */
  private parseInitializedCommentDialogData(dialogData: GenericDialogData): any {
    const commentData = {};
    Object.entries(dialogData.form).forEach(entry => {
      const [key, value] = entry;
      commentData[key] = value.controlsConfig[0] ?
        (value.controlsConfig[0].value ? value.controlsConfig[0].value : value.controlsConfig[0]) : '';
    });
    return commentData;
  }

  saveComment(value): void {
    const dialogRes = {
      title: value.commentTitle,
      description: value.commentDescription,
      // relatedFindings: this.selectedFindings ? this.selectedFindings : []
    };

    this.commentService.saveComment(
      this.dialogData.options[0].additionalData.id,
      transformCommentToRequestBody(dialogRes)
    ).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (newComment: Comment) => {
        this.store.dispatch(new UpdatePentestComments(newComment.id));
        this.dialogRef.close();
        this.notificationService.showPopup('comment.popup.save.success', PopupType.SUCCESS);
      },
      error: err => {
        console.error(err);
        this.onRequestFailed(value);
        this.notificationService.showPopup('comment.popup.save.failed', PopupType.FAILURE);
      }
    });
  }

  updateComment(value): void {
    const dialogRes = {
      title: value.commentTitle,
      description: value.commentDescription,
      // relatedFindings: this.selectedFindings ? this.selectedFindings : []
    };

    this.commentService.updateComment(
      this.dialogData.options[0].additionalData.id,
      transformCommentToRequestBody(dialogRes)
    ).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (updatedComment: Comment) => {
        this.dialogRef.close();
        this.notificationService.showPopup('comment.popup.update.success', PopupType.SUCCESS);
      },
      error: err => {
        console.error(err);
        this.onRequestFailed(value);
        this.notificationService.showPopup('comment.popup.update.failed', PopupType.FAILURE);
      }
    });
  }

  private onRequestFailed(retryParameter: any): void {
    this.dialogService.openRetryDialog({key: 'global.retry.dialog', data: null}).onClose
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((ref) => {
        if (ref.retry) {
          this.onClickSave(retryParameter);
        }
      });
  }
}
