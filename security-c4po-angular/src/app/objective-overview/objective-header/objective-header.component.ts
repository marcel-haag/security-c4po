import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {Route} from '@shared/models/route.enum';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {PROJECT_STATE_NAME, ProjectState} from '@shared/stores/project-state/project-state';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {BehaviorSubject} from 'rxjs';
import {Project} from '@shared/models/project.model';

@UntilDestroy()
@Component({
  selector: 'app-objective-header',
  templateUrl: './objective-header.component.html',
  styleUrls: ['./objective-header.component.scss']
})
export class ObjectiveHeaderComponent implements OnInit {

  readonly fa = FA;
  selectedProjectTitle$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private store: Store,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.store.select(ProjectState.project).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedProject: Project) => {
        this.selectedProjectTitle$.next(selectedProject?.title);
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

  onClickExportPentest(): void {
    // tslint:disable-next-line:no-console
    console.info('To be implemented..');
  }
}