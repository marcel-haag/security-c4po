import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
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
import {shareReplay, tap} from 'rxjs/operators';
import {downloadFile} from '@shared/functions/download-file.function';
import {Loading, LoadingState} from '@shared/models/loading.model';
import {DialogService} from '@shared/services/dialog-service/dialog.service';

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
    protected dialogRef: NbDialogRef<ExportReportDialogComponent>,
    private dialogService: DialogService
  ) {
  }
  // HTML
  readonly fa = FA;
  // form control elements
  exportReportFormatControl = new UntypedFormControl(ExportFormatOptions.PDF);
  exportReportLanguageControl = new UntypedFormControl(LanguageOptions.ENGLISH);
  // exports
  exportFormats = ExportFormatOptions;
  exportLanguages = LanguageOptions;

  dialogData: GenericDialogData;

  selectedEvaluatedProject$: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  completedProjectPentests$: BehaviorSubject<any> = new BehaviorSubject<any>({completedObjectivesNumber: 0});
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  // Loading Bar Property
  downloadPentestReport$: Observable<Loading<ArrayBuffer>>;
  progress = 0;

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
          this.selectedEvaluatedProject$.next(project);
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
    // Get project id from dialog data
    const projectId = this.dialogData.options[0].additionalData.id;
    // Loading is true as long as there is a response from the reporting service
    this.loading$.next(true);
    // Export pentest in choosen format
    switch (reportFormat) {
      case ExportFormatOptions.PDF: {
        this.downloadPentestReport$ = this.reportingService.getReportPDFforProjectById(projectId, reportLanguage)
          .pipe(
            shareReplay(),
            untilDestroyed(this)
          );
        this.downloadPentestReport$.subscribe({
          next: (response) => {
            if (response.state === LoadingState.DONE) {
              downloadFile(response.content, 'application/pdf');
              this.loading$.next(false);
              this.notificationService.showPopup('report.popup.generation.success', PopupType.SUCCESS);
            }
          },
          error: error => {
            console.error(error);
            this.loading$.next(false);
            this.onRequestFailed(reportFormat, reportLanguage);
            this.notificationService.showPopup('report.popup.generation.failed', PopupType.FAILURE);
          }
        });
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

  onRequestFailed(reportFormat: string, reportLanguage: string): void {
    this.dialogService.openRetryDialog({key: 'global.retry.dialog', data: null}).onClose
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((ref) => {
        if (ref.retry) {
          // ToDo: Send same request again
          this.onClickExport(reportFormat, reportLanguage);
        }
      });
  }
}

export enum ExportFormatOptions {
  PDF = 'PDF',
  CSV = 'CSV',
  HTML = 'HTML'
}

export enum LanguageOptions {
  ENGLISH = 'en-US',
  GERMAN = 'de-DE'
}
