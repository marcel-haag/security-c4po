import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FindingDialogComponent} from './finding-dialog.component';
import {CommonModule} from '@angular/common';
import {
  NB_DIALOG_CONFIG,
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbFormFieldModule,
  NbInputModule,
  NbLayoutModule, NbTagModule
} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule, Validators} from '@angular/forms';
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
import {Severity} from '@shared/models/severity.enum';
import {Finding} from '@shared/models/finding.model';
import Mock = jest.Mock;
import {Category} from '@shared/models/category.model';
import {PentestStatus} from '@shared/models/pentest-status.model';
import {PROJECT_STATE_NAME, ProjectState, ProjectStateModel} from '@shared/stores/project-state/project-state';
import {NgxsModule, Store} from '@ngxs/store';

const DESIRED_PROJECT_STATE_SESSION: ProjectStateModel = {
  selectedProject: {
    id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
    client: 'E Corp',
    title: 'Some Mock API (v1.0) Scanning',
    createdAt: new Date('2019-01-10T09:00:00'),
    tester: 'Novatester',
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
    findingsIds: ['56c47c56-3bcd-45f1-a05b-c197dbd33112'],
    commentsIds: []
  },
};

describe('FindingDialogComponent', () => {
  let component: FindingDialogComponent;
  let fixture: ComponentFixture<FindingDialogComponent>;
  let store: Store;

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        FindingDialogComponent
      ],
      imports: [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        NbButtonModule,
        FlexLayoutModule,
        NbInputModule,
        NbFormFieldModule,
        NbTagModule,
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
        NgxsModule.forRoot([ProjectState]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: NotificationService, useValue: new NotificationServiceMock()},
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: dialogSpy},
        {provide: NB_DIALOG_CONFIG, useValue: mockedFindingDialogData}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideProvider(NB_DIALOG_CONFIG, {useValue: mockedFindingDialogData});
    fixture = TestBed.createComponent(FindingDialogComponent);
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

export const createSpyObj = (baseName, methodNames): { [key: string]: Mock<any> } => {
  const obj: any = {};
  for (const i of methodNames) {
    obj[i] = jest.fn();
  }
  return obj;
};

export const mockFinding: Finding = {
  id: '11-22-33',
  severity: Severity.LOW,
  title: 'Test Finding',
  description: 'Test Description',
  impact: 'Test Impact',
  affectedUrls: ['https://test.de'],
  reproduction: 'Step N: Test',
  mitigation: 'Mitigation Test'
};

export const mockedFindingDialogData = {
  form: {
    findingTitle: {
      fieldName: 'findingTitle',
      type: 'formText',
      labelKey: 'finding.title.label',
      placeholder: 'finding.title',
      controlsConfig: [
        {value: mockFinding ? mockFinding.title : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.titleRequired'}
      ]
    },
    findingSeverity: {
      fieldName: 'findingSeverity',
      type: 'severity-select',
      labelKey: 'finding.severity.label',
      placeholder: 'finding.severity',
      controlsConfig: [
        {value: mockFinding ? mockFinding.severity : Severity.LOW, disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.severityRequired'}
      ]
    },
    findingDescription: {
      fieldName: 'findingDescription',
      type: 'formText',
      labelKey: 'finding.description.label',
      placeholder: 'finding.description',
      controlsConfig: [
        {value: mockFinding ? mockFinding.description : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.descriptionRequired'}
      ]
    },
    findingImpact: {
      fieldName: 'findingImpact',
      type: 'formText',
      labelKey: 'finding.impact.label',
      placeholder: 'finding.impact',
      controlsConfig: [
        {value: mockFinding ? mockFinding.impact : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.impactRequired'}
      ]
    },
    findingAffectedUrls: {
      fieldName: 'findingAffectedUrls',
      type: 'text',
      labelKey: 'finding.affectedUrls.label',
      placeholder: 'finding.affectedUrls.placeholder',
      controlsConfig: [
        {value: '', disabled: false},
        []
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.affectedUrlsRequired'}
      ]
    },
    findingReproduction: {
      fieldName: 'findingReproduction',
      type: 'text',
      labelKey: 'finding.reproduction.label',
      placeholder: 'finding.reproduction',
      controlsConfig: [
        {value: mockFinding ? mockFinding.reproduction : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.reproductionRequired'}
      ]
    },
    findingMitigation: {
      fieldName: 'findingMitigation',
      type: 'text',
      labelKey: 'finding.mitigation.label',
      placeholder: 'finding.mitigation',
      controlsConfig: [
        {value: mockFinding ? mockFinding.mitigation : '', disabled: false},
        []
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.mitigationRequired'}
      ]
    }
  },
  options: [
    {
      headerLabelKey: 'finding.create.header',
      buttonKey: 'global.action.save',
      accentColor: 'info'
    },
  ]
};
