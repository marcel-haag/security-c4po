import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {Project} from '@shared/models/project.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ProjectService} from '@shared/services/api/project.service';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {filter, tap} from 'rxjs/operators';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {Router} from '@angular/router';
import {Route} from '@shared/models/route.enum';
import {InitProjectState} from '@shared/stores/project-state/project-state.actions';
import {Store} from '@ngxs/store';

@UntilDestroy()
@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {
  // HTML only
  readonly fa = FA;

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  projects$: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  constructor(
    private readonly notificationService: NotificationService,
    private store: Store,
    private router: Router,
    private projectService: ProjectService,
    private dialogService: DialogService,
    private projectDialogService: ProjectDialogService) {
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects()
      .pipe(
        tap(() => this.loading$.next(true)),
        untilDestroyed(this)
      )
      .subscribe({
        next: (projects: Project[]) => {
          this.projects$.next(projects);
          this.loading$.next(false);
        },
        error: err => {
          console.log(err);
          this.notificationService.showPopup('project.popup.not.found', PopupType.FAILURE);
          this.loading$.next(false);
        }
      });
  }

  onClickAddProject(): void {
    this.projectDialogService.openProjectDialog(
      ProjectDialogComponent,
      null,
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
        this.loadProjects();
      }
    });
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
        this.loadProjects();
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

  // HTML only
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  private deleteProject(project: Project): void {
    this.projectService.deleteProjectById(project.id).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        this.loadProjects();
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
