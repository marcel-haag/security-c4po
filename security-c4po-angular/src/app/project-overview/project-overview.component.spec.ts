import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectOverviewComponent} from './project-overview.component';
import {DateTimeFormatPipe} from '@shared/pipes/date-time-format.pipe';
import {CommonModule} from '@angular/common';
import {ProjectOverviewRoutingModule} from './project-overview-routing.module';
import {NbButtonModule, NbCardModule, NbProgressBarModule, NbSpinnerModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ProjectService} from '@shared/services/api/project.service';
import {HttpLoaderFactory} from '../common-app.module';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotificationService} from '@shared/services/toaster-service/notification.service';
import {NotificationServiceMock} from '@shared/services/toaster-service/notification.service.mock';
import {ProjectServiceMock} from '@shared/services/api/project.service.mock';
import {ThemeModule} from '@assets/@theme/theme.module';
import {LoadingSpinnerComponent} from '@shared/widgets/loading-spinner/loading-spinner.component';
import {KeycloakService} from 'keycloak-angular';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {ProjectDialogServiceMock} from '@shared/modules/project-dialog/service/project-dialog.service.mock';
import {MockComponent, MockPipe} from 'ng-mocks';

describe('ProjectOverviewComponent', () => {
  let component: ProjectOverviewComponent;
  let fixture: ComponentFixture<ProjectOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectOverviewComponent,
        MockComponent(LoadingSpinnerComponent),
        MockPipe(DateTimeFormatPipe)
      ],
      imports: [
        CommonModule,
        ProjectOverviewRoutingModule,
        NbCardModule,
        NbButtonModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        TranslateModule,
        NbProgressBarModule,
        NbSpinnerModule,
        HttpClientTestingModule,
        ThemeModule.forRoot(),
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
    fixture = TestBed.createComponent(ProjectOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
