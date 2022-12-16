import { TestBed } from '@angular/core/testing';

import { CommentDialogService } from './comment-dialog.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbDialogModule, NbDialogRef} from '@nebular/theme';
import {CommentDialogServiceMock} from '@shared/modules/comment-dialog/service/comment-dialog.service.mock';

describe('CommentDialogService', () => {
  let service: CommentDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NbDialogModule.forChild()
      ],
      providers: [
        {provide: CommentDialogService, useClass: CommentDialogServiceMock},
        {provide: NbDialogRef, useValue: {}},
      ]
    });
    service = TestBed.inject(CommentDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
