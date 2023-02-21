import { TestBed } from '@angular/core/testing';

import { ReportingService } from './reporting.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../../../environments/environment';

describe('ReportingService', () => {
  let service: ReportingService;
  let httpMock: HttpTestingController;

  const reportBaseURL = `${environment.reportEndpoint}/reports`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ]
    });
    service = TestBed.inject(ReportingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
