import { TestBed } from '@angular/core/testing';

import { ExportReportDialogService } from './export-report-dialog.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbDialogModule, NbDialogRef} from '@nebular/theme';
import {ExportReportDialogServiceMock} from '@shared/modules/export-report-dialog/service/export-report-dialog.service.mock';

describe('ExportReportDialogService', () => {
  let service: ExportReportDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NbDialogModule.forChild()
      ],
      providers: [
        {provide: ExportReportDialogService, useClass: ExportReportDialogServiceMock},
        {provide: NbDialogRef, useValue: {}},
      ]
    });
    service = TestBed.inject(ExportReportDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
