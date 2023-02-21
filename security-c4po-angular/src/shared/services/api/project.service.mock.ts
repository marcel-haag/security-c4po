import {ProjectService} from '@shared/services/api/project.service';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Project, ProjectDialogBody} from '@shared/models/project.model';


export class ProjectServiceMock implements Required<ProjectService> {

  private http: HttpClient;

  getProjects(): Observable<Project[]> {
    return of([]);
  }

  getCompletedProjectById(projectId: string): Observable<Project> {
    return of();
  }

  getEvaluatedProjectById(projectId: string): Observable<Project> {
    return of();
  }

  saveProject(saveProject: ProjectDialogBody): Observable<Project> {
    return of();
  }

  updateProject(projectId: string, project: ProjectDialogBody): Observable<Project> {
    return of();
  }

  deleteProjectById(projectId: string): Observable<string> {
    return of();
  }
}
