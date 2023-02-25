import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Route} from '@shared/models/route.enum';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {Project} from '@shared/models/project.model';

@UntilDestroy()
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(
    private store: Store,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.store.select(ProjectState.project).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedProject: Project) => {
        this.initProjectStore();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  private initProjectStore(): void {
    this.router.navigate([Route.OBJECTIVE_OVERVIEW]).then(() => {
    }, err => {
      this.router.navigate([Route.PROJECT_OVERVIEW]);
      console.error(err);
    });
  }
}
