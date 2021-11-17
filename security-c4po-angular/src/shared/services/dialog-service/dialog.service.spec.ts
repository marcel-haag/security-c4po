import {TestBed} from '@angular/core/testing';

import {DialogService} from './dialog.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NbDialogModule, NbDialogRef} from '@nebular/theme';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NbDialogModule.forRoot()
      ],
      providers: [
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: {}},
      ]
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
