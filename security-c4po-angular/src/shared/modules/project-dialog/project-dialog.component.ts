import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldStatus} from '@shared/models/form-field-status.model';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit, OnDestroy {
  // form control elements
  projectFormGroup: FormGroup;
  projectTitleCtrl: AbstractControl;
  projectClientCtrl: AbstractControl;
  projectTesterCtrl: AbstractControl;

  formCtrlStatus = FieldStatus.BASIC;

  invalidProjectTitle: string;
  invalidProjectClient: string;
  invalidProjectTester: string;

  readonly MIN_LENGTH: number = 2;

  constructor(
    private fb: FormBuilder,
    protected dialogRef: NbDialogRef<ProjectDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.projectFormGroup = this.fb.group({
      projectTitle: ['', [Validators.required, Validators.minLength(this.MIN_LENGTH)]],
      projectClient: ['', [Validators.required, Validators.minLength(this.MIN_LENGTH)]],
      projectTester: ['', [Validators.required, Validators.minLength(this.MIN_LENGTH)]]
    });

    this.projectTitleCtrl = this.projectFormGroup.get('projectTitle');
    this.projectClientCtrl = this.projectFormGroup.get('projectClient');
    this.projectTesterCtrl = this.projectFormGroup.get('projectTester');

    this.projectFormGroup.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.formCtrlStatus = FieldStatus.BASIC;
      });
  }

  onClickSave(value): void {
    this.dialogRef.close({
      title: value.projectTitle,
      client: value.projectClient,
      tester: value.projectTester
    });
  }

  onClickClose(): void {
    this.dialogRef.close();
  }

  formIsEmptyOrInvalid(): boolean {
    return this.isEmpty(this.projectTitleCtrl.value)
      || this.isEmpty(this.projectClientCtrl.value)
      || this.isEmpty(this.projectTesterCtrl.value)
      || this.projectTitleCtrl.invalid
      || this.projectClientCtrl.invalid
      || this.projectTesterCtrl.invalid;
  }

  /**
   * @param ctrlValue of type string
   * @return if ctrlValue is empty or not
   */
  isEmpty(ctrlValue: string): boolean {
    return ctrlValue === '';
  }

  ngOnDestroy(): void {
  }
}
