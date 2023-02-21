import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Finding} from '@shared/models/finding.model';

@Injectable({
  providedIn: 'root'
})
export class FindingService {

  private apiBaseURL = `${environment.apiEndpoint}/pentests`;

  constructor(
    private http: HttpClient,
    private readonly store: Store) {
  }

  /**
   * Get Findings for Pentest Id
   * @param pentestId the id of the project
   */
  public getFindingsByPentestId(pentestId: string): Observable<Finding[]> {
    return this.http.get<Finding[]>(`${this.apiBaseURL}/${pentestId}/findings`);
  }

  /**
   * Get Finding by Id
   * @param findingId the id of the finding
   */
  public getFindingById(findingId: string): Observable<Finding> {
    return this.http.get<Finding>(`${this.apiBaseURL}/${findingId}/finding`);
  }

  /**
   * Save Finding
   * @param pentestId the id of the pentest
   * @param finding the information of the finding
   */
  public saveFinding(pentestId: string, finding: Finding): Observable<Finding> {
    return this.http.post<Finding>(`${this.apiBaseURL}/${pentestId}/finding`, finding);
  }

  /**
   * Update Finding
   * @param findingId the id of the finding
   * @param finding the information of the finding
   */
  public updateFinding(findingId: string, finding: Finding): Observable<Finding> {
    return this.http.patch<Finding>(`${this.apiBaseURL}/${findingId}/finding`, finding);
  }

  /**
   * Delete Finding
   * @param pentestId the id of the pentest
   * @param findingId the id of the finding
   */
  public deleteFindingByPentestAndFindingId(pentestId: string, findingId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseURL}/${pentestId}/finding/${findingId}`);
  }
}
