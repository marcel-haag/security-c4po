import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportReportDialogComponent} from './export-report-dialog.component';
import {CommonModule} from '@angular/common';
import {
  NB_DIALOG_CONFIG,
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbFormFieldModule,
  NbInputModule,
  NbLayoutModule, NbRadioModule,
  NbTagModule
} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NotificationService} from '@shared/services/toaster-service/notification.service';
import {NotificationServiceMock} from '@shared/services/toaster-service/notification.service.mock';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {createSpyObj} from '@shared/modules/finding-dialog/finding-dialog.component.spec';
import {Project, ProjectPentests} from '@shared/models/project.model';
import {PentestStatus} from '@shared/models/pentest-status.model';
import {ObjectiveChartModule} from '@shared/modules/objective-chart/objective-chart.module';
import {forwardRef} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

describe('ExportReportDialogComponent', () => {
  let component: ExportReportDialogComponent;
  let fixture: ComponentFixture<ExportReportDialogComponent>;

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        ExportReportDialogComponent
      ],
      imports: [
        NbCardModule,
        NbButtonModule,
        NbFormFieldModule,
        NbInputModule,
        FlexLayoutModule,
        FontAwesomeModule,
        TranslateModule,
        ReactiveFormsModule,
        NbRadioModule,
        ObjectiveChartModule,
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
        NgxsModule.forRoot([]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: NotificationService, useValue: new NotificationServiceMock()},
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: dialogSpy},
        {provide: NB_DIALOG_CONFIG, useValue: mockedExportPentestDialogData}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideProvider(NB_DIALOG_CONFIG, {useValue: mockedExportPentestDialogData});
    fixture = TestBed.createComponent(ExportReportDialogComponent);
    component = fixture.componentInstance;
    component.selectedProject$.next(mockProject);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const mockedPentests: ProjectPentests[] = [
  {
    pentestId: '122',
    status: PentestStatus.COMPLETED
  }
];

const mockProject: Project = {
  id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
  client: 'E Corp',
  title: 'Some Mock API (v1.0) Scanning',
  createdAt: new Date('2019-01-10T09:00:00'),
  tester: 'Novatester',
  summary: '',
  projectPentests: mockedPentests,
  testingProgress: 0,
  createdBy: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
};

export const mockedExportPentestDialogData = {
  form: {},
  options: [
    {
      headerLabelKey: 'finding.create.header',
      buttonKey: 'global.action.save',
      accentColor: 'info',
      additionalData: mockProject
    },
  ]
};
