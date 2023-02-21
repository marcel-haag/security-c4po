import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {GenericDialogData} from '@shared/models/generic-dialog-data';
import {NB_DIALOG_CONFIG, NbDialogRef} from '@nebular/theme';
import {ReportingService} from '@shared/services/reporting/reporting.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Project} from '@shared/models/project.model';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, Observable} from 'rxjs';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {ProjectService} from '@shared/services/api/project.service';
import {PentestStatus} from '@shared/models/pentest-status.model';
import {tap} from 'rxjs/operators';
import {downloadFile} from '@shared/functions/download-file.function';

@Component({
  selector: 'app-export-report-dialog',
  templateUrl: './export-report-dialog.component.html',
  styleUrls: ['./export-report-dialog.component.scss']
})
@UntilDestroy()
export class ExportReportDialogComponent implements OnInit {

  constructor(
    @Inject(NB_DIALOG_CONFIG) private data: GenericDialogData,
    private projectService: ProjectService,
    private reportingService: ReportingService,
    private readonly notificationService: NotificationService,
    protected dialogRef: NbDialogRef<ExportReportDialogComponent>
  ) {
  }

  // HTML
  readonly fa = FA;
  // form control elements
  exportReportFormatControl = new FormControl(ExportFormatOptions.PDF);
  exportReportLanguageControl = new FormControl(ExportLanguageOptions.ENGLISH);
  // exports
  exportFormats = ExportFormatOptions;
  exportLanguages = ExportLanguageOptions;

  dialogData: GenericDialogData;

  selectedProject$: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  completedProjectPentests$: BehaviorSubject<any> = new BehaviorSubject<any>({completedObjectivesNumber: 0});
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  ngOnInit(): void {
    this.dialogData = this.data;
    this.loadEvaluatedProject();
  }

  loadEvaluatedProject(): void {
    // Get project id from dialog data
    const projectId = this.dialogData.options[0].additionalData.id;
    // Request project information by id
    this.projectService.getEvaluatedProjectById(projectId)
      .pipe(
        tap(() => this.loading$.next(true)),
        untilDestroyed(this)
      )
      .subscribe({
        next: (project: Project) => {
          this.selectedProject$.next(project);
          const completedPentestObjectives = project.projectPentests.filter(pentest => pentest.status === PentestStatus.COMPLETED);
          this.completedProjectPentests$.next({completedObjectivesNumber: completedPentestObjectives.length});
          this.loading$.next(false);
        },
        error: err => {
          console.log(err);
          this.notificationService.showPopup('project.popup.not.found', PopupType.FAILURE);
          this.loading$.next(false);
        }
      });
  }

  onClickExport(reportFormat: string, reportLanguage: string): void {
    // Loading is true as long as there is a response from the reporting service
    this.loading$.next(true);
    // Export pentest in choosen format
    switch (reportFormat) {
      case ExportFormatOptions.PDF: {
        this.reportingService.getReportPDFforProjectById(this.selectedProject$.getValue().id).pipe(
          untilDestroyed(this)
        ).subscribe({
          next: (response) => {
            downloadFile(response, 'application/pdf');
            this.loading$.next(false);
            this.notificationService.showPopup('report.popup.generation.success', PopupType.SUCCESS);
          },
          error: error => {
            console.error(error);
            this.loading$.next(false);
            this.notificationService.showPopup('report.popup.generation.failed', PopupType.FAILURE);
          }
        });
        break;
      }
      case ExportFormatOptions.CSV: {
        this.loading$.next(false);
        this.notificationService.showPopup('report.popup.generation.failed', PopupType.FAILURE);
        break;
      }
      case ExportFormatOptions.HTML: {
        this.loading$.next(false);
        this.notificationService.showPopup('report.popup.generation.failed', PopupType.FAILURE);
        break;
      }
      default: {
        this.loading$.next(false);
        this.notificationService.showPopup('report.popup.generation.failed', PopupType.FAILURE);
        break;
      }
    }
  }

  onClickClose(): void {
    this.dialogRef.close();
  }

  // HTML only
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}

export enum ExportFormatOptions {
  PDF = 'PDF',
  CSV = 'CSV',
  HTML = 'HTML'
}

export enum ExportLanguageOptions {
  ENGLISH = 'en-US',
  GERMAN = 'de-DE'
}
