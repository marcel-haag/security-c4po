import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {Project} from '@shared/models/project.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ProjectService} from '@shared/services/api/project.service';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {startWith, tap} from 'rxjs/operators';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {FormControl} from '@angular/forms';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {Pentest} from '@shared/models/pentest.model';
import {Route} from '@shared/models/route.enum';
import {SetAvailableProjects} from '@shared/stores/project-state/project-state.actions';

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
  allProjectsCount$: BehaviorSubject<any> = new BehaviorSubject<any>({allProjectsCount: 0});

  constructor(
    private readonly notificationService: NotificationService,
    private store: Store,
    private router: Router,
    private projectService: ProjectService,
    private dialogService: DialogService,
    private projectDialogService: ProjectDialogService) {
  }

  ngOnInit(): void {
    // Load all available projects
    this.loadProjects();
    // Subscribe to project store
    this.store.select(ProjectState.allProjects).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (projects: Project[]) => {
        if (projects && projects.length === 0) {
          this.loadProjects();
        } else {
        }
      },
      error: err => {
        console.error(err);
      }
    });
    // Setup Search
    this.projectSearch = new FormControl({value: '', disabled: this.allProjects$.getValue() === []});
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
          if (projects) {
            this.projects$.next(projects);
            this.allProjects$.next(projects);
            this.allProjectsCount$.next({allProjectsCount: projects.length});
            this.store.dispatch(new SetAvailableProjects(projects));
          } else {
            this.projects$.next([]);
            this.allProjects$.next([]);
            this.allProjectsCount$.next({allProjectsCount: 0});
          }
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

  // HTML only
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
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
}
