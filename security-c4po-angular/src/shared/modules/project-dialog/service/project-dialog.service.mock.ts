import {ComponentType} from '@angular/cdk/overlay';
import {NbDialogConfig} from '@nebular/theme';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {Project} from '@shared/models/project.model';
import {Observable, of} from 'rxjs';

export class ProjectDialogServiceMock implements Required<ProjectDialogService> {

  dialog: any;

  openProjectDialog(
    componentOrTemplateRef: ComponentType<any>,
    project: Project | undefined,
    config: Partial<NbDialogConfig<Partial<any> | string>> | undefined): Observable<any> {
    return of(undefined);
  }
}
