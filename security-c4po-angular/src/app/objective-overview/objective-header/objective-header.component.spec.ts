import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectiveHeaderComponent} from './objective-header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../common-app.module';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {PROJECT_STATE_NAME, ProjectState, ProjectStateModel} from '@shared/stores/project-state/project-state';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NbActionsModule, NbIconModule} from '@nebular/theme';
import {ProjectService} from '@shared/services/project.service';
import {ProjectServiceMock} from '@shared/services/project.service.mock';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {ProjectDialogServiceMock} from '@shared/modules/project-dialog/service/project-dialog.service.mock';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {NotificationService} from '@shared/services/notification.service';
import {NotificationServiceMock} from '@shared/services/notification.service.mock';
import {Category} from '@shared/models/category.model';
import {PentestStatus} from '@shared/models/pentest-status.model';

const DESIRED_PROJECT_STATE_SESSION: ProjectStateModel = {
  selectedProject: {
    id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
    client: 'E Corp',
    title: 'Some Mock API (v1.0) Scanning',
    createdAt: new Date('2019-01-10T09:00:00'),
    tester: 'Novatester',
    summary: '',
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
    findingIds: [],
    commentIds: ['56c47c56-3bcd-45f1-a05b-c197dbd33112']
  },
};

describe('ObjectiveHeaderComponent', () => {
  let component: ObjectiveHeaderComponent;
  let fixture: ComponentFixture<ObjectiveHeaderComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectiveHeaderComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ThemeModule.forRoot(),
        FontAwesomeModule,
        NbIconModule,
        NbActionsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([ProjectState])
      ],
      providers: [
        {provide: ProjectService, useValue: new ProjectServiceMock()},
        {provide: ProjectDialogService, useClass: ProjectDialogServiceMock},
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NotificationService, useValue: new NotificationServiceMock()}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveHeaderComponent);
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
