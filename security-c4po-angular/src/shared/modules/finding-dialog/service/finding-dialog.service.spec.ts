import { TestBed } from '@angular/core/testing';

import { FindingDialogService } from './finding-dialog.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbDialogModule, NbDialogRef} from '@nebular/theme';
import {FindingDialogServiceMock} from '@shared/modules/finding-dialog/service/finding-dialog.service.mock';

describe('FindingDialogService', () => {
  let service: FindingDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NbDialogModule.forRoot()
      ],
      providers: [
        {provide: FindingDialogService, useClass: FindingDialogServiceMock},
        {provide: NbDialogRef, useValue: {}},
      ]
    });
    service = TestBed.inject(FindingDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
