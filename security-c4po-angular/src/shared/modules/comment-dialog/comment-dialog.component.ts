import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericDialogData, GenericFormFieldConfig} from '@shared/models/generic-dialog-data';
import * as FA from '@fortawesome/free-solid-svg-icons';
import deepEqual from 'deep-equal';
import {NB_DIALOG_CONFIG, NbDialogRef} from '@nebular/theme';
import {UntilDestroy} from '@ngneat/until-destroy';
import {RelatedFindingOption} from '@shared/models/comment.model';

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

  relatedFindings: RelatedFindingOption[] = [];
  // Includes the findings that got selected as an option
  selectedFindings: RelatedFindingOption[] = [];
  initialSelectedFindings: RelatedFindingOption[] = [];

  constructor(
    @Inject(NB_DIALOG_CONFIG) private data: GenericDialogData,
    private fb: FormBuilder,
    protected dialogRef: NbDialogRef<CommentDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.dialogData = this.data;
    this.relatedFindings = this.dialogData.options[0].additionalData;
    this.commentFormGroup = this.generateFormCreationFieldArray();
  }

  generateFormCreationFieldArray(): FormGroup {
    this.formArray = Object.values(this.data.form);
    const config = this.formArray?.reduce((accumulator: {}, currentValue: GenericFormFieldConfig) => ({
      ...accumulator,
      [currentValue?.fieldName]: currentValue?.controlsConfig
    }), {});
    // tslint:disable-next-line:no-string-literal
    const preSelectedRelatedFindings = this.data.form['commentRelatedFindings'].controlsConfig[0].value;
    if (preSelectedRelatedFindings && preSelectedRelatedFindings.length > 0) {
      this.relatedFindings.forEach(finding => {
        if (preSelectedRelatedFindings.includes(finding)) {
          this.initialSelectedFindings.push(finding);
          this.selectedFindings.push(finding);
        }
      });
    }
    return this.fb.group(config);
  }

  changeSelected($event): void {
    // tslint:disable-next-line:no-string-literal
    this.selectedFindings = this.commentFormGroup.controls['commentRelatedFindings'].value;
  }

  onClickSave(value: any): void {
    this.dialogRef.close({
      title: value.commentTitle,
      description: value.commentDescription,
      relatedFindings: this.selectedFindings ? this.selectedFindings : []
    });
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
      // Related Findings form field can be ignored since changes here will be recognised inside commentRelatedFindings of tag-list
      if (value === null || key === 'commentRelatedFindings') {
        newCommentData[key] = '';
      }
    });
    const didChange = !deepEqual(oldCommentData, newCommentData) || !deepEqual(this.initialSelectedFindings, this.selectedFindings);
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
      // Related Findings form field can be ignored since changes here will be recognised inside commentRelatedFindings of tag-list
      if (key === 'commentRelatedFindings') {
        commentData[key] = '';
      }
    });
    return commentData;
  }
}
