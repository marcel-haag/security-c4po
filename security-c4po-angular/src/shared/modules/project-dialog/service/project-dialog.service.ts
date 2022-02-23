import {Injectable} from '@angular/core';
import {NbDialogConfig, NbDialogService} from '@nebular/theme';
import {ComponentType} from '@angular/cdk/overlay';
import {Observable} from 'rxjs';
import {Project} from '@shared/models/project.model';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {Validators} from '@angular/forms';
import {ProjectDialogData} from '@shared/models/project-dialog-data';

@Injectable()
export class ProjectDialogService {

  constructor(private readonly dialog: NbDialogService) {
  }

  private readonly MIN_LENGTH: number = 4;

  static addDataToDialogConfig(
    dialogOptions?: Partial<NbDialogConfig<Partial<any> | string>>,
    projectData?: ProjectDialogData
  ): Partial<NbDialogConfig<Partial<any> | string>> {
    return {
      context: {data: projectData},
      closeOnEsc: dialogOptions?.closeOnEsc || false,
      hasScroll: dialogOptions?.hasScroll || false,
      autoFocus: dialogOptions?.autoFocus || false,
      closeOnBackdropClick: dialogOptions?.closeOnBackdropClick || false
    };
  }

  public openProjectDialog(componentOrTemplateRef: ComponentType<any>,
                           project?: Project,
                           config?: Partial<NbDialogConfig<Partial<any> | string>>): Observable<any> {
    let dialogOptions: Partial<NbDialogConfig<Partial<any> | string>>;
    let dialogData: ProjectDialogData;
    // Setup ProjectDialogData
    dialogData = {
      form: {
        projectTitle: {
          fieldName: 'projectTitle',
          type: 'text',
          labelKey: 'project.title.label',
          placeholder: 'project.title',
          controlsConfig: [
            {value: project ? project.title : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'project.validationMessage.titleRequired'}
          ]
        },
        projectClient: {
          fieldName: 'projectClient',
          type: 'text',
          labelKey: 'project.client.label',
          placeholder: 'project.client',
          controlsConfig: [
            {value: project ? project.client : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'project.validationMessage.clientRequired'}
          ]
        },
        projectTester: {
          fieldName: 'projectTester',
          type: 'text',
          labelKey: 'project.tester.label',
          placeholder: 'project.tester',
          controlsConfig: [
            {value: project ? project.tester : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'project.validationMessage.testerRequired'}
          ]
        }
      },
      options: []
    };
    if (project) {
      dialogData.options = [
        {
          headerLabelKey: 'project.edit.header',
          buttonKey: 'global.action.update',
          accentColor: 'warning'
        },
      ];
    } else {
      dialogData.options = [
        {
          headerLabelKey: 'project.create.header',
          buttonKey: 'global.action.save',
          accentColor: 'primary'
        },
      ];
    }
    // Merge dialog config with project data
    dialogOptions = ProjectDialogService.addDataToDialogConfig(config, dialogData);
    return this.dialog.open(ProjectDialogComponent, dialogOptions).onClose;
  }
}
