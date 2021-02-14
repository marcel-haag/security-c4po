import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
  }

  onClickGetProjects(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getProjects()
      .pipe(untilDestroyed(this))
      .subscribe((projects) => {
        this.projects.next(projects);
      });
  }

  ngOnDestroy(): void {
  }

}
