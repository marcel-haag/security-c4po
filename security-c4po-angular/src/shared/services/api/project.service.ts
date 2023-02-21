import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Project, ProjectDialogBody} from '../../models/project.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiBaseURL = `${environment.apiEndpoint}/projects`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get Projects
   */
  public getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiBaseURL}`);
  }

  /**
   * Get completed project by id
   */
  public getCompletedProjectById(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiBaseURL}/${projectId}`);
  }

  /**
   * Get evaluated project by id
   */
  public getEvaluatedProjectById(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiBaseURL}/evaluation/${projectId}`);
  }

  /**
   * Save Project
   * @param project the information of the project
   */
  public saveProject(project: ProjectDialogBody): Observable<Project> {
    return this.http.post<Project>(`${this.apiBaseURL}`, project);
  }

  /**
   * Update Project
   * @param projectId the id of the project
   * @param project the information of the project
   */
  public updateProject(projectId: string, project: ProjectDialogBody): Observable<Project> {
    return this.http.patch<Project>(`${this.apiBaseURL}/${projectId}`, project);
  }

  /**
   * Delete Project
   * @param projectId the id of the project
   */
  public deleteProjectById(projectId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseURL}/${projectId}`);
  }
}
