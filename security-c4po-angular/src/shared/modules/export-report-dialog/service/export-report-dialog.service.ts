import { Injectable } from '@angular/core';
import {NbDialogConfig, NbDialogService} from '@nebular/theme';
import {GenericDialogData} from '@shared/models/generic-dialog-data';
import {ComponentType} from '@angular/cdk/overlay';
import {Observable} from 'rxjs';
import {ExportReportDialogComponent} from '@shared/modules/export-report-dialog/export-report-dialog.component';
import {Project} from '@shared/models/project.model';

@Injectable()
export class ExportReportDialogService {
  constructor(private readonly dialog: NbDialogService) {
  }

  private readonly MIN_LENGTH: number = 4;

  static addDataToDialogConfig(
    dialogOptions?: Partial<NbDialogConfig<Partial<any> | string>>,
    reportData?: GenericDialogData
  ): Partial<NbDialogConfig<Partial<any> | string>> {
    return {
      context: {data: reportData},
      closeOnEsc: dialogOptions?.closeOnEsc || false,
      hasScroll: dialogOptions?.hasScroll || false,
      autoFocus: dialogOptions?.autoFocus || false,
      closeOnBackdropClick: dialogOptions?.closeOnBackdropClick || false
    };
  }

  public openExportReportDialog(componentOrTemplateRef: ComponentType<any>,
                                project?: Project,
                                config?: Partial<NbDialogConfig<Partial<any> | string>>): Observable<any> {
    let dialogOptions: Partial<NbDialogConfig<Partial<any> | string>>;
    let dialogData: GenericDialogData;
    // Setup ExportReportDialogBody
    dialogData = {
      form: {
      },
      options: [
        {
          headerLabelKey: 'report.dialog.header',
          buttonKey: 'report.generate',
          accentColor: 'info',
          additionalData: project
        },
      ]
    };
    // Merge dialog config with finding data
    dialogOptions = ExportReportDialogService.addDataToDialogConfig(config, dialogData);
    return this.dialog.open(ExportReportDialogComponent, dialogOptions).onClose;
  }
}
