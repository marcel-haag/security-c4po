import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWidgetComponent } from './project-widget.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NbButtonModule, NbCardModule, NbProgressBarModule} from '@nebular/theme';
import {MockPipe} from 'ng-mocks';
import {DateTimeFormatPipe} from '@shared/pipes/date-time-format.pipe';
import {ProjectService} from '@shared/services/api/project.service';
import {ProjectServiceMock} from '@shared/services/api/project.service.mock';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {ProjectDialogServiceMock} from '@shared/modules/project-dialog/service/project-dialog.service.mock';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {NotificationService} from '@shared/services/toaster-service/notification.service';
import {NotificationServiceMock} from '@shared/services/toaster-service/notification.service.mock';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';
import {KeycloakService} from 'keycloak-angular';
import {ThemeModule} from '@assets/@theme/theme.module';

describe('ProjectWidgetComponent', () => {
  let component: ProjectWidgetComponent;
  let fixture: ComponentFixture<ProjectWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectWidgetComponent,
        MockPipe(DateTimeFormatPipe)
      ],
      imports: [
        ThemeModule.forRoot(),
        NbProgressBarModule,
        NbCardModule,
        NbButtonModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([SessionState])
      ],
      providers: [
        KeycloakService,
        {provide: ProjectService, useValue: new ProjectServiceMock()},
        {provide: ProjectDialogService, useClass: ProjectDialogServiceMock},
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NotificationService, useClass: NotificationServiceMock}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWidgetComponent);
    component = fixture.componentInstance;
    // ToDo: fix detectChanges() when project input is defined
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
