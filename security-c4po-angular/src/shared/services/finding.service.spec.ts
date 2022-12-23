import { TestBed } from '@angular/core/testing';

import { FindingService } from './finding.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {ProjectState} from '@shared/stores/project-state/project-state';

describe('FindingService', () => {
  let service: FindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([ProjectState])
      ]
    });
    service = TestBed.inject(FindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
