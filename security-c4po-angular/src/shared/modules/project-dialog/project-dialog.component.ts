import {Component, Inject, OnInit} from '@angular/core';
import {NB_DIALOG_CONFIG, NbDialogRef} from '@nebular/theme';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericFormFieldConfig, GenericDialogData} from '@shared/models/generic-dialog-data';
import deepEqual from 'deep-equal';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectService} from '@shared/services/api/project.service';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';

@UntilDestroy()
@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  // form control elements
  projectFormGroup: FormGroup;
  formArray: GenericFormFieldConfig[];

  dialogData: GenericDialogData;

  constructor(
    @Inject(NB_DIALOG_CONFIG) private data: GenericDialogData,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private projectService: ProjectService,
    private readonly notificationService: NotificationService,
    protected dialogRef: NbDialogRef<ProjectDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.projectFormGroup = this.generateFormCreationFieldArray();
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

  onClickSave(value): void {
    if (this.dialogData.options[0].headerLabelKey.includes('create')) {
      // Save
      this.saveProject(value);
    } else {
      // Update
      this.updateProject(value);
    }
  }

  onClickClose(): void {
    this.dialogRef.close();
  }

  allowSave(): boolean {
    return this.projectFormGroup.valid && this.projectDataChanged();
  }

  /**
   * @return true if project data is different from initial value
   */
  private projectDataChanged(): boolean {
    const oldProjectData = this.parseInitializedProjectDialogData(this.dialogData);
    const newProjectData = this.projectFormGroup.getRawValue();
    Object.entries(newProjectData).forEach(entry => {
      const [key, value] = entry;
      if (value === null) {
        newProjectData[key] = '';
      }
    });
    const didChange = !deepEqual(oldProjectData, newProjectData);
    return didChange;
  }

  /**
   * @param dialogData of type ProjectDialogData
   * @return parsed projectData
   */
  private parseInitializedProjectDialogData(dialogData: GenericDialogData): any {
    const projectData = {};
    Object.entries(dialogData.form).forEach(entry => {
      const [key, value] = entry;
      projectData[key] = value.controlsConfig[0] ?
        (value.controlsConfig[0].value ? value.controlsConfig[0].value : value.controlsConfig[0]) : '';
    });
    return projectData;
  }

  private saveProject(value): void {
    const dialogRes = {
      title: value.projectTitle,
      client: value.projectClient,
      tester: value.projectTester,
      summary: value.projectSummary
    };
    this.projectService.saveProject(dialogRes).pipe(
      untilDestroyed(this)
    ).subscribe(
      {
        next: () => {
          this.notificationService.showPopup('project.popup.save.success', PopupType.SUCCESS);
          this.dialogRef.close();
        },
        error: err => {
          console.error(err);
          this.onRequestFailed(value);
          this.notificationService.showPopup('project.popup.save.failed', PopupType.FAILURE);
        }
      }
    );
  }

  private updateProject(value): void {
    const dialogRes = {
      title: value.projectTitle,
      client: value.projectClient,
      tester: value.projectTester,
      summary: value.projectSummary
    };
    this.projectService.updateProject(this.dialogData.options[0].additionalData.id, dialogRes).pipe(
      untilDestroyed(this)
    ).subscribe(
      {
        next: () => {
          this.notificationService.showPopup('project.popup.update.success', PopupType.SUCCESS);
          this.dialogRef.close();
        },
        error: err => {
          console.error(err);
          this.onRequestFailed(value);
          this.notificationService.showPopup('project.popup.update.failed', PopupType.FAILURE);
        }
      }
    );
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
