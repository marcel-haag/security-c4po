import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericDialogData, GenericFormFieldConfig} from '@shared/models/generic-dialog-data';
import {NB_DIALOG_CONFIG, NbDialogRef, NbTagComponent} from '@nebular/theme';
import deepEqual from 'deep-equal';
import {UntilDestroy} from '@ngneat/until-destroy';
import {Severity} from '@shared/models/severity.enum';
import * as FA from '@fortawesome/free-solid-svg-icons';

@UntilDestroy()
@Component({
  selector: 'app-finding-dialog',
  templateUrl: './finding-dialog.component.html',
  styleUrls: ['./finding-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FindingDialogComponent implements OnInit {
  // form control elements
  findingFormGroup: FormGroup;
  formArray: GenericFormFieldConfig[];

  dialogData: GenericDialogData;

  // HTML only
  readonly fa = FA;
  severity: Severity = Severity.LOW;
  readonly severityTexts: Array<SeverityText> = [
    {value: Severity.LOW, translationText: 'severities.low'},
    {value: Severity.MEDIUM, translationText: 'severities.medium'},
    {value: Severity.HIGH, translationText: 'severities.high'},
    {value: Severity.CRITICAL, translationText: 'severities.critical'}
  ];

  // ToDo: Adjust for edit finding dialog to include existing urls
  affectedUrls: string[] = [];

  constructor(
    @Inject(NB_DIALOG_CONFIG) private data: GenericDialogData,
    private fb: FormBuilder,
    protected dialogRef: NbDialogRef<FindingDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.findingFormGroup = this.generateFormCreationFieldArray();
    this.dialogData = this.data;
  }

  generateFormCreationFieldArray(): FormGroup {
    this.formArray = Object.values(this.data.form);
    const config = this.formArray?.reduce((accumulator: {}, currentValue: GenericFormFieldConfig) => ({
      ...accumulator,
      [currentValue?.fieldName]: currentValue?.controlsConfig
    }), {});
    return this.fb.group(config);
  }

  onClickSave(value: any): void {
    this.dialogRef.close({
      title: value.findingTitle,
      severity: this.formArray[1].controlsConfig[0].value,
      description: value.findingDescription,
      impact: value.findingImpact,
      affectedUrls: this.affectedUrls ? this.affectedUrls : [],
      reproduction: value.findingReproduction,
      mitigation: value.findingMitigation
    });
  }

  onAffectedUrlAdd(): void {
    // tslint:disable-next-line:no-string-literal
    const newUrl = this.findingFormGroup.controls['findingAffectedUrls'].value;
    if (newUrl) {
      this.affectedUrls.push(newUrl);
    }
    // tslint:disable-next-line:no-string-literal
    this.findingFormGroup.controls['findingAffectedUrls'].reset('');
  }

  onAffectedUrlTagRemove(tagToRemove: NbTagComponent): void {
    this.affectedUrls = this.affectedUrls.filter(t => t !== tagToRemove.text);
  }

  onClickClose(): void {
    this.dialogRef.close();
  }

  allowSave(): boolean {
    return this.findingFormGroup.valid && this.findingDataChanged();
  }

  /**
   * @return the correct nb-status for current severity
   */
  getSeverityFillStatus(value: number): string {
    let severityFillStatus;
    switch (value) {
      case 0: {
        severityFillStatus = 'basic';
        break;
      }
      case 1: {
        severityFillStatus = 'info';
        break;
      }
      case 2: {
        severityFillStatus = 'warning';
        break;
      }
      case 3: {
        severityFillStatus = 'danger';
        break;
      }
      default: {
        severityFillStatus = 'control';
        break;
      }
    }
    return severityFillStatus;
  }

  /**
   * @return true if finding data is different from initial value
   */
  private findingDataChanged(): boolean {
    const oldFindingData = this.parseInitializedFindingDialogData(this.dialogData);
    const newFindingData = this.findingFormGroup.getRawValue();
    Object.entries(newFindingData).forEach(entry => {
      const [key, value] = entry;
      if (value === null) {
        newFindingData[key] = '';
      }
    });
    const didChange = !deepEqual(oldFindingData, newFindingData);
    return didChange;
  }

  /**
   * @param dialogData of type GenericDialogData
   * @return parsed findingData
   */
  private parseInitializedFindingDialogData(dialogData: GenericDialogData): any {
    const findingData = {};
    Object.entries(dialogData.form).forEach(entry => {
      const [key, value] = entry;
      findingData[key] = value.controlsConfig[0] ?
        (value.controlsConfig[0].value ? value.controlsConfig[0].value : value.controlsConfig[0]) : '';
    });
    return findingData;
  }
}

interface SeverityText {
  value: Severity;
  translationText: string;
}
