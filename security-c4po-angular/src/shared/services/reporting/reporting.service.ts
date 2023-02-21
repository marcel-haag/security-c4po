import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(private http: HttpClient) {
  }

  private reportBaseURL = `${environment.reportEndpoint}/reports`;

  /**
   * Get PDF Report by project id
   */
  public getReportPDFforProjectById(projectId: string): Observable<ArrayBuffer> {
    // @ts-ignore
    return this.http.get<ArrayBuffer>(`${this.reportBaseURL}/${projectId}/pdf`, {responseType: 'arraybuffer'})
  }
}
