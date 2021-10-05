import {ProjectService} from '@shared/services/project.service';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Project} from '@shared/models/project.model';


export class ProjectServiceMock implements Required<ProjectService> {

  private http: HttpClient;

  getProjects(): Observable<Project[]> {
    return of([]);
  }
}
