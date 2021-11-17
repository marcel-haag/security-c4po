import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Project, SaveProjectDialogBody} from '../models/project.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiBaseURL = `${environment.apiEndpoint}/projects`;

  constructor(private http: HttpClient) {
  }

  public getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiBaseURL}`);
  }

  /**
   * Save Project
   * @param project the information of the project
   */
  public saveProject(project: SaveProjectDialogBody): Observable<Project> {
    return this.http.post<Project>(`${this.apiBaseURL}`, project);
  }
}
