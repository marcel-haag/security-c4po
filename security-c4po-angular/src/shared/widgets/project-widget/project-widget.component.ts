import {Component, Input, OnInit} from '@angular/core';
import {Project} from '@shared/models/project.model';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {ReportState} from '@shared/models/state.enum';
import {Route} from '@shared/models/route.enum';
import {ChangePentest, InitProjectState, SetAvailableProjects} from '@shared/stores/project-state/project-state.actions';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {filter, tap} from 'rxjs/operators';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {ProjectService} from '@shared/services/api/project.service';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';

@Component({
  selector: 'app-project-widget',
  templateUrl: './project-widget.component.html',
  styleUrls: ['./project-widget.component.scss']
})
@UntilDestroy()
export class ProjectWidgetComponent implements OnInit {

  @Input() project: Project;

  // HTML only
  readonly fa = FA;

  constructor(
    private readonly notificationService: NotificationService,
    private store: Store,
    private router: Router,
    private projectService: ProjectService,
    private dialogService: DialogService,
    private projectDialogService: ProjectDialogService
  ) {
  }

  ngOnInit(): void {
  }

  onClickRouteToProject(project): void {
    this.router.navigate([Route.OBJECTIVE_OVERVIEW]).then(() => {
      this.store.dispatch(new InitProjectState(
        project,
        [],
        []
      )).pipe(untilDestroyed(this)).subscribe();
    }, err => {
      console.error(err);
    });
  }

  /**
   * HTML only
   * @return the correct nb-accent for current report state of the project
   */
  getProjectAccentFillStatus(value: any): string {
    let reportStateFillStatus;
    const statusValue = typeof value !== 'number' ? ReportState[value] : value;
    // Check for correct accent color of status
    switch (statusValue) {
      case 6:
      case 7: {
        reportStateFillStatus = 'success';
        break;
      }
      case 0: {
        reportStateFillStatus = 'info';
        break;
      }
      case 8:
      case 9:
      case 11:
      case 12: {
        reportStateFillStatus = 'warning';
        break;
      }
      case 1:
      case 10: {
        reportStateFillStatus = 'danger';
        break;
      }
      default: {
        reportStateFillStatus = 'control';
        break;
      }
    }
    return reportStateFillStatus;
  }

  onClickEditProject(project: Project): void {
    this.projectDialogService.openProjectDialog(
      ProjectDialogComponent,
      project,
      {
        closeOnEsc: false,
        hasScroll: false,
        autoFocus: true,
        closeOnBackdropClick: false
      }
    ).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        // ToDo: Find way to edit / delete the single project from project store instead
        this.store.dispatch(new SetAvailableProjects([]));
      }
    });
  }

  onClickDeleteProject(project: Project): void {
    // Set dialog message
    const message = {
      title: 'project.delete.title',
      key: 'project.delete.key',
      data: {name: project.title},
    } as any;
    // Check if project is empty
    if (project.testingProgress === 0) {
      this.dialogService.openConfirmDialog(
        message
      ).onClose.pipe(
        filter((confirm) => !!confirm),
        untilDestroyed(this)
      ).subscribe({
        next: () => {
          this.deleteProject(project);
        }
      });
    } else {
      const secMessage = {
        title: 'project.delete.title',
        key: 'project.delete.sec.key',
        confirmString: project.title.toString(),
        inputPlaceholderKey: 'project.delete.confirmStringPlaceholder',
        data: {name: project.title, confirmString: project.title.toString()},
      } as any;
      // Set confirm string
      // message.data.confirmString = project.title;
      this.dialogService.openSecurityConfirmDialog(
        secMessage
      ).onClose.pipe(
        filter((confirm) => !!confirm),
        untilDestroyed(this)
      ).subscribe({
        next: () => {
          this.deleteProject(project);
        }
      });
    }
  }

  private deleteProject(project: Project): void {
    this.projectService.deleteProjectById(project.id).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        // ToDo: Find way to edit / delete the single project from project store instead
        this.store.dispatch(new SetAvailableProjects([]));
        this.notificationService.showPopup('project.popup.delete.success', PopupType.SUCCESS);
      }, error: error => {
        this.notificationService.showPopup('project.popup.delete.failed', PopupType.FAILURE);
        this.onRequestFailed(project);
        console.error(error);
      }
    });
  }

  private onRequestFailed(retryParameter: any): void {
    this.dialogService.openRetryDialog({key: 'global.retry.dialog', data: null}).onClose
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((ref) => {
        if (ref.retry) {
          this.deleteProject(retryParameter);
        }
      });
  }
}
