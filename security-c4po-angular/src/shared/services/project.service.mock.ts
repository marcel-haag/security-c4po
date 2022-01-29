import {ProjectService} from '@shared/services/project.service';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Project, SaveProjectDialogBody} from '@shared/models/project.model';


export class ProjectServiceMock implements Required<ProjectService> {

  private http: HttpClient;

  getProjects(): Observable<Project[]> {
    return of([]);
  }

  saveProject(saveProject: SaveProjectDialogBody): Observable<Project> {
    return of();
  }

  deleteProjectById(projectId: string): Observable<string> {
    return of();
  }
}
