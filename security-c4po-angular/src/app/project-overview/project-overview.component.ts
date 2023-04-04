import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {Project} from '@shared/models/project.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ProjectService} from '@shared/services/api/project.service';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {filter, startWith, tap} from 'rxjs/operators';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {Router} from '@angular/router';
import {Route} from '@shared/models/route.enum';
import {InitProjectState} from '@shared/stores/project-state/project-state.actions';
import {Store} from '@ngxs/store';
import {ReportState} from '@shared/models/state.enum';
import {FormControl} from '@angular/forms';

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
  allProjects$: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  // Search
  projectSearch: FormControl;
  protected filter$: Observable<string>;

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
    // Setup Search
    this.projectSearch = new FormControl({value: '', disabled: !this.allProjects$.getValue()});
    this.setFilterObserverForProjects();
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
          this.allProjects$.next(projects);
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

  onClickResetFilter(): void {
    this.projectSearch.reset('');
    this.projects$.next(this.allProjects$.getValue());
  }

  private setFilterObserverForProjects(): void {
    this.filter$ = this.projectSearch.valueChanges.pipe(startWith(''));
    this.filter$.subscribe(
      (filterString: string) => {
        if (filterString.length === 0) {
          this.projects$.next(this.allProjects$.getValue());
        } else {
          const matchingProjects: Project[] = [];
          this.allProjects$.getValue().forEach(project => {
            // Project attributes that the user can filter through
            if (
              project.title.toLowerCase().includes(filterString.toLowerCase())
              || project.client.toLowerCase().includes(filterString.toLowerCase())
              || project.tester.toLowerCase().includes(filterString.toLowerCase())
              || project.state.toString().toLowerCase().includes(filterString.toLowerCase())
            ) {
              matchingProjects.push(project);
            }
          });
          this.projects$.next(matchingProjects);
        }
      }
    );
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
