import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SecurityConfirmDialogComponent} from './security-confirm-dialog.component';
import {CommonModule} from '@angular/common';
import {NB_DIALOG_CONFIG, NbButtonModule, NbCardModule, NbDialogRef, NbLayoutModule, NbStatusService} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MockProvider} from 'ng-mocks';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {createSpyObj} from '@shared/modules/project-dialog/project-dialog.component.spec';
import {SecurityDialogMessage} from '@shared/services/dialog-service/dialog-message';

describe('SecurityConfirmDialogComponent', () => {
  let component: SecurityConfirmDialogComponent;
  let fixture: ComponentFixture<SecurityConfirmDialogComponent>;

  class DummyMockObj {
    public static data = {
      key: 'test.key',
      confirmString: 'test',
    } as SecurityDialogMessage;
  }

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        SecurityConfirmDialogComponent
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
        {provide: NbDialogRef, useValue: dialogSpy},
        {provide: NB_DIALOG_CONFIG, useValue: { data: DummyMockObj.data } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
