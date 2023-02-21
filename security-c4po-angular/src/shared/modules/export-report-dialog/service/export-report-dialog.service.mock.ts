import {ComponentType} from '@angular/cdk/overlay';
import {NbDialogConfig} from '@nebular/theme';
import {Observable, of} from 'rxjs';
import {ExportReportDialogService} from '@shared/modules/export-report-dialog/service/export-report-dialog.service';
import {Project} from '@shared/models/project.model';

export class ExportReportDialogServiceMock implements Required<ExportReportDialogService> {

  dialog: any;

  openExportReportDialog(
    componentOrTemplateRef: ComponentType<any>,
    project: Project | undefined,
    config: Partial<NbDialogConfig<Partial<any> | string>> | undefined): Observable<any> {
    return of(undefined);
  }
}
