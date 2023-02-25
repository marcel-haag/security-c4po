import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {Route} from '@shared/models/route.enum';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {PROJECT_STATE_NAME, ProjectState} from '@shared/stores/project-state/project-state';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {BehaviorSubject} from 'rxjs';
import {Project, ProjectDialogBody} from '@shared/models/project.model';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {filter, mergeMap} from 'rxjs/operators';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {ProjectService} from '@shared/services/api/project.service';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {InitProjectState} from '@shared/stores/project-state/project-state.actions';
import {ExportReportDialogService} from '@shared/modules/export-report-dialog/service/export-report-dialog.service';
import {ExportReportDialogComponent} from '@shared/modules/export-report-dialog/export-report-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-objective-header',
  templateUrl: './objective-header.component.html',
  styleUrls: ['./objective-header.component.scss']
})
export class ObjectiveHeaderComponent implements OnInit {

  readonly fa = FA;
  selectedProject$: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);

  constructor(private store: Store,
              private readonly notificationService: NotificationService,
              private dialogService: DialogService,
              private projectDialogService: ProjectDialogService,
              private projectService: ProjectService,
              private exportReportDialogService: ExportReportDialogService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.store.select(ProjectState.project).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedProject: Project) => {
        if (selectedProject) {
          this.selectedProject$.next(selectedProject);
        } else {
          this.router.navigate([Route.PROJECT_OVERVIEW]);
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  onClickRouteBack(): void {
    this.router.navigate([Route.PROJECT_OVERVIEW])
      .then(
        () => this.store.reset({
          ...this.store.snapshot(),
          [PROJECT_STATE_NAME]: undefined
        })
      ).finally();
  }

  onClickEditPentestProject(): void {
    this.projectDialogService.openProjectDialog(
      ProjectDialogComponent,
      this.selectedProject$.getValue(),
      {
        closeOnEsc: false,
        hasScroll: false,
        autoFocus: true,
        closeOnBackdropClick: false
      }
    ).pipe(
      filter(value => !!value),
      mergeMap((value: ProjectDialogBody) => this.projectService.updateProject(this.selectedProject$.getValue().id, value)),
      untilDestroyed(this)
    ).subscribe({
      next: (project: Project) => {
        this.store.dispatch(new InitProjectState(
          project,
          [],
          []
        )).pipe(untilDestroyed(this)).subscribe();
        this.notificationService.showPopup('project.popup.update.success', PopupType.SUCCESS);
      },
      error: error => {
        console.error(error);
        this.notificationService.showPopup('project.popup.update.failed', PopupType.FAILURE);
      }
    });
  }

  onClickGeneratePentestReport(): void {
    this.exportReportDialogService.openExportReportDialog(
      ExportReportDialogComponent,
      this.selectedProject$.getValue(),
      {
        closeOnEsc: true,
        hasScroll: false,
        autoFocus: true,
        closeOnBackdropClick: true
      }
    ).pipe(
      filter(value => !!value),
      /*ToDo: Needed?*/
      /*mergeMap((value: ProjectDialogBody) => this.projectService.updateProject(this.selectedProject$.getValue().id, value)),*/
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        // ToDo: Open report in new Tab or just download it?
        // this.notificationService.showPopup('project.popup.update.success', PopupType.SUCCESS);
      },
      error: error => {
        console.error(error);
        // this.notificationService.showPopup('project.popup.update.failed', PopupType.FAILURE);
      }
    });
  }
}
