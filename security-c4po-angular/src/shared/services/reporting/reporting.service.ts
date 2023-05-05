import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Loading} from '@shared/models/loading.model';
import { loadContent } from '@shared/functions/load-content';

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
  public getReportPDFforProjectById(projectId: string, reportLanguage: string): Observable<Loading<ArrayBuffer>> {
    return this.http.get(`${this.reportBaseURL}/${projectId}/pdf/${reportLanguage}`,
      {
        // @ts-ignore
        responseType: 'arraybuffer',
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(loadContent<ArrayBuffer>());
  }
}

export interface ReportDownloadConfiguration {
  options: {
    headers: HttpHeaders;
    params: HttpParams;
    observe: 'events';
    reportProgress: true;
    responseType: 'arraybuffer';
    withCredentials?: boolean;
  };
}
