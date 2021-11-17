import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectDialogComponent} from './project-dialog.component';
import {CommonModule} from '@angular/common';
import {NbButtonModule, NbCardModule, NbDialogRef, NbFormFieldModule, NbInputModule, NbLayoutModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NotificationService} from '@shared/services/notification.service';
import {NotificationServiceMock} from '@shared/services/notification.service.mock';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {ReactiveFormsModule} from '@angular/forms';

describe('ProjectDialogComponent', () => {
  let component: ProjectDialogComponent;
  let fixture: ComponentFixture<ProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectDialogComponent
      ],
      imports: [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        NbButtonModule,
        FlexLayoutModule,
        NbInputModule,
        NbFormFieldModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ThemeModule.forRoot(),
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
        {provide: NotificationService, useValue: new NotificationServiceMock()},
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: {}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
