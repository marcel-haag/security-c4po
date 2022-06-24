import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {InitProjectState} from '@shared/stores/project-state/project-state.actions';
import {Router} from '@angular/router';
import {Route} from '@shared/models/route.enum';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
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
    if (history?.state && 'selectedProject' in history?.state) {
      this.initProjectStore();
    } else {
      this.router.navigate([Route.PROJECT_OVERVIEW]).finally();
    }
  }

  private initProjectStore(): void {
    const project: Project = history?.state?.selectedProject ? history?.state?.selectedProject : null;
    this.store.dispatch(new InitProjectState(
      project,
      [],
      []
    )).pipe(untilDestroyed(this)).subscribe();
  }
}
