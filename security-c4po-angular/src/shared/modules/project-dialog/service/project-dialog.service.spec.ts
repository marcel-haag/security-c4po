import { TestBed } from '@angular/core/testing';

import { ProjectDialogService } from './project-dialog.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbDialogModule, NbDialogRef} from '@nebular/theme';
import {ProjectDialogServiceMock} from '@shared/modules/project-dialog/service/project-dialog.service.mock';

describe('ProjectDialogService', () => {
  let service: ProjectDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NbDialogModule.forRoot()
      ],
      providers: [
        {provide: ProjectDialogService, useClass: ProjectDialogServiceMock},
        {provide: NbDialogRef, useValue: {}},
      ]
    });
    service = TestBed.inject(ProjectDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
