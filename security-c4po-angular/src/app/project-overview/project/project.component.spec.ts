import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectComponent} from './project.component';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NbCardModule, NbDialogRef, NbLayoutModule} from '@nebular/theme';
import {KeycloakService} from 'keycloak-angular';
import {ObjectiveOverviewModule} from '../../objective-overview';
import {NotificationService} from '@shared/services/toaster-service/notification.service';
import {NotificationServiceMock} from '@shared/services/toaster-service/notification.service.mock';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {ProjectService} from '@shared/services/api/project.service';
import {ProjectServiceMock} from '@shared/services/api/project.service.mock';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {ProjectDialogServiceMock} from '@shared/modules/project-dialog/service/project-dialog.service.mock';
import {PROJECT_STATE_NAME, ProjectState, ProjectStateModel} from '@shared/stores/project-state/project-state';
import {Category} from '@shared/models/category.model';
import {PentestStatus} from '@shared/models/pentest-status.model';
import {createSpyObj} from '@shared/modules/finding-dialog/finding-dialog.component.spec';
import {ExportReportDialogService} from '@shared/modules/export-report-dialog/service/export-report-dialog.service';
import {ExportReportDialogServiceMock} from '@shared/modules/export-report-dialog/service/export-report-dialog.service.mock';
import {ReportState} from '@shared/models/state.enum';

const DESIRED_PROJECT_STATE_SESSION: ProjectStateModel = {
  allProjects: [],
  selectedProject: {
    id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
    client: 'E Corp',
    title: 'Some Mock API (v1.0) Scanning',
    createdAt: new Date('2019-01-10T09:00:00'),
    tester: 'Novatester',
    summary: '',
    state: ReportState.NEW,
    version: '1.0',
    testingProgress: 0,
    createdBy: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
  },
  // Manages Categories
  disabledCategories: [],
  selectedCategory: Category.INFORMATION_GATHERING,
  // Manages Pentests of Category
  disabledPentests: [],
  selectedPentest: {
    id: '56c47c56-3bcd-45f1-a05b-c197dbd33112',
    category: Category.INFORMATION_GATHERING,
    refNumber: 'OTF-001',
    childEntries: [],
    status: PentestStatus.NOT_STARTED,
    enabled: true,
    findingIds: [],
    commentIds: ['56c47c56-3bcd-45f1-a05b-c197dbd33112']
  },
};

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let store: Store;

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        ProjectComponent
      ],
      imports: [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        ObjectiveOverviewModule,
        ThemeModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([ProjectState]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        KeycloakService,
        {provide: ProjectService, useValue: new ProjectServiceMock()},
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: dialogSpy},
        {provide: ExportReportDialogService, useClass: ExportReportDialogServiceMock},
        {provide: ProjectDialogService, useClass: ProjectDialogServiceMock},
        {provide: NotificationService, useClass: NotificationServiceMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      [PROJECT_STATE_NAME]: DESIRED_PROJECT_STATE_SESSION
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
