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
import {NotificationService, PopupType} from '@shared/services/notification.service';
import {ProjectService} from '@shared/services/project.service';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {InitProjectState} from '@shared/stores/project-state/project-state.actions';

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
              private projectService: ProjectService,
              private dialogService: DialogService,
              private projectDialogService: ProjectDialogService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.store.select(ProjectState.project).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedProject: Project) => {
        this.selectedProject$.next(selectedProject);
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

  onClickExportPentest(): void {
    // tslint:disable-next-line:no-console
    console.info('To be implemented..');
  }
}
