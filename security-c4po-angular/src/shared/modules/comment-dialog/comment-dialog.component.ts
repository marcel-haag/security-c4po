import {ChangeDetectionStrategy, Component, Inject, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericDialogData, GenericFormFieldConfig} from '@shared/models/generic-dialog-data';
import * as FA from '@fortawesome/free-solid-svg-icons';
import deepEqual from 'deep-equal';
import {NB_DIALOG_CONFIG, NbDialogRef} from '@nebular/theme';
import {PentestService} from '@shared/services/pentest.service';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Pentest} from '@shared/models/pentest.model';
import {Store} from '@ngxs/store';
import {Finding} from '@shared/models/finding.model';
import {RelatedFindingOption} from '@shared/models/comment.model';
import {BehaviorSubject} from 'rxjs';
import {FindingService} from '@shared/services/finding.service';

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
    protected dialogRef: NbDialogRef<CommentDialogComponent>,
    private readonly findingService: FindingService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.commentFormGroup = this.generateFormCreationFieldArray();
    this.dialogData = this.data;
    // Resets related Findings input fields when comment was found in dialog context
    // tslint:disable-next-line:no-string-literal
    // this.commentFormGroup.controls['commentRelatedFindings'].reset('');
  }

  changeSelected($event): void {
    // Latest Value
    console.info($event[$event.length - 1].value);
    // use this element at the end
    // tslint:disable-next-line:no-string-literal
    console.warn(this.commentFormGroup.controls['commentRelatedFindings'].value);
    // tslint:disable-next-line:no-string-literal
    this.selectedFindings = this.commentFormGroup.controls['commentRelatedFindings'].value;
  }

  generateFormCreationFieldArray(): FormGroup {
    this.formArray = Object.values(this.data.form);
    const config = this.formArray?.reduce((accumulator: {}, currentValue: GenericFormFieldConfig) => ({
      ...accumulator,
      [currentValue?.fieldName]: currentValue?.controlsConfig
    }), {});
    // tslint:disable-next-line:no-string-literal
    const relatedFindings = this.data.form['commentRelatedFindings'].controlsConfig[0].value;
    if (relatedFindings && relatedFindings.length > 0) {
      // ToDo: Select included findings here (selectedFindings / initialSelectedFindings)
      console.warn('IF (EDIT)', relatedFindings);
      this.renderRelatedFindings(relatedFindings);
    } else {
      this.renderRelatedFindings([]);
    }
    return this.fb.group(config);
  }

  renderRelatedFindings(relatedFindings: any): void {
    this.store.select(ProjectState.pentest).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedPentest: Pentest) => {
        // console.warn(selectedPentest.findingIds);
        this.requestRelatedFindingsData(selectedPentest.id, relatedFindings);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  requestRelatedFindingsData(pentestId: string, relatedFindings: any): void {
    this.findingService.getFindingsByPentestId(pentestId).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (findings: Finding[]) => {
        findings.forEach(finding => this.relatedFindings.push({id: finding.id, title: finding.title} as RelatedFindingOption));
        // ToDo: Only add the findings that were included in
        console.info('initialSelectedFindings OnINIT ', relatedFindings);
        // findings.forEach(finding => this.initialSelectedFindings.push({id: finding.id, title: finding.title} as RelatedFindingOption));
      },
      error: err => {
        console.error(err);
      }
    });
  }

  onClickSave(value: any): void {
    this.dialogRef.close({
      title: value.commentTitle,
      description: value.commentDescription,
      // ToDo: Refactor this to only include the ids this.commentFormGroup.controls['commentRelatedFindings'].value
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
    /* ToDo: Use for EDIT implementation
    console.info('initialSelectedFindings: ', this.initialSelectedFindings);
    console.info('selectedFindings: ', this.selectedFindings);
    console.info('deepEqual related Findings: ', deepEqual(this.initialSelectedFindings, this.selectedFindings));
    */
    const didChange = !deepEqual(oldCommentData, newCommentData) || !deepEqual(this.initialSelectedFindings, this.selectedFindings);
    return didChange;
  }

  /**
   * @param dialogData of type GenericDialogData
   * @return parsed findingData
   */
  private parseInitializedCommentDialogData(dialogData: GenericDialogData): any {
    const findingData = {};
    Object.entries(dialogData.form).forEach(entry => {
      const [key, value] = entry;
      // console.info(key);
      findingData[key] = value.controlsConfig[0] ?
        (value.controlsConfig[0].value ? value.controlsConfig[0].value : value.controlsConfig[0]) : '';
      // Related Findings form field can be ignored since changes here will be recognised inside commentRelatedFindings of tag-list
      if (key === 'commentRelatedFindings') {
        findingData[key] = '';
      }
    });
    return findingData;
  }
}
