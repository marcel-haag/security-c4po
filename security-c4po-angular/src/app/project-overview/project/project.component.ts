import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {InitProjectState} from '@shared/stores/project-state/project-state.actions';
import {Router} from '@angular/router';
import {Route} from '@shared/models/route.enum';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Project} from '@shared/models/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, OnDestroy {

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

  ngOnDestroy(): void {
    // This method must be present when using ngx-take-until-destroy
    // even when empty
  }
}
