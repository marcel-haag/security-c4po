import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetryDialogComponent} from './retry-dialog.component';
import {CommonModule} from '@angular/common';
import {NbButtonModule, NbCardModule, NbDialogRef, NbLayoutModule, NbStatusService} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MockProvider} from 'ng-mocks';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';

describe('RetryDialogComponent', () => {
  let component: RetryDialogComponent;
  let fixture: ComponentFixture<RetryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RetryDialogComponent
      ],
      imports: [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        NbButtonModule,
        FlexLayoutModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        MockProvider(NbStatusService),
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
