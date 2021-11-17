import {Component, OnDestroy, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {Project, SaveProjectDialogBody} from '@shared/models/project.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ProjectService} from '@shared/services/project.service';
import {NotificationService, PopupType} from '@shared/services/notification.service';
import {filter, mergeMap, tap} from 'rxjs/operators';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {NB_DIALOG_CONFIG} from '@nebular/theme/components/dialog/dialog-config';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {

  readonly fa = FA;

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  constructor(
    private readonly projectService: ProjectService,
    private readonly dialogService: DialogService,
    private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects()
      .pipe(
        untilDestroyed(this),
        tap(() => this.loading$.next(true))
      )
      .subscribe({
        next: (projects) => {
          this.projects.next(projects);
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
    this.dialogService.openCustomDialog(
      ProjectDialogComponent,
      {
        closeOnEsc: false,
        hasScroll: false,
        autoFocus: false,
        closeOnBackdropClick: false
      }
    ).onClose.pipe(
      filter(value => !!value),
      mergeMap((value: SaveProjectDialogBody) => this.projectService.saveProject(value)),
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        this.loadProjects();
        this.notificationService.showPopup('project.popup.save.success', PopupType.SUCCESS);
      },
      error: error => {
        console.error(error);
        this.notificationService.showPopup('project.popup.save.failed', PopupType.FAILURE);
      }
    });
  }

  onClickEditProject(): void {
    console.log('to be implemented...');
  }

  onClickDeleteProject(): void {
    console.log('to be implemented...');
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  ngOnDestroy(): void {
    // This method must be present when using ngx-take-until-destroy
    // even when empty
  }
}
