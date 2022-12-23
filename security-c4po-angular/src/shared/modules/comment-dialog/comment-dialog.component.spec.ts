import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CommentDialogComponent} from './comment-dialog.component';
import {PROJECT_STATE_NAME, ProjectState, ProjectStateModel} from '@shared/stores/project-state/project-state';
import {Category} from '@shared/models/category.model';
import {PentestStatus} from '@shared/models/pentest-status.model';
import {NgxsModule, Store} from '@ngxs/store';
import {CommonModule} from '@angular/common';
import {
  NB_DIALOG_CONFIG,
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbFormFieldModule,
  NbInputModule,
  NbLayoutModule, NbSelectModule,
  NbTagModule
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
import Mock = jest.Mock;
import {Finding} from '@shared/models/finding.model';
import {Severity} from '@shared/models/severity.enum';
import {Comment} from '@shared/models/comment.model';

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
    findingIds: [],
    commentIds: ['56c47c56-3bcd-45f1-a05b-c197dbd33112']
  },
};

describe('CommentDialogComponent', () => {
  let component: CommentDialogComponent;
  let fixture: ComponentFixture<CommentDialogComponent>;
  let store: Store;

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        CommentDialogComponent
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
        NbSelectModule,
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
        {provide: NB_DIALOG_CONFIG, useValue: mockedCommentDialogData}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideProvider(NB_DIALOG_CONFIG, {useValue: mockedCommentDialogData});
    fixture = TestBed.createComponent(CommentDialogComponent);
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

export const mockComment: Comment = {
  id: '11-22-33',
  title: 'Test Finding',
  description: 'Test Description',
  relatedFindings: ['68c47c56-3bcd-45f1-a05b-c197dbd33224']
};

export const mockedCommentDialogData = {
  form: {
    commentTitle: {
      fieldName: 'commentTitle',
      type: 'formText',
      labelKey: 'comment.title.label',
      placeholder: 'comment.title',
      controlsConfig: [
        {value: mockComment ? mockComment.title : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'comment.validationMessage.titleRequired'}
      ]
    },
    commentDescription: {
      fieldName: 'commentDescription',
      type: 'formText',
      labelKey: 'comment.description.label',
      placeholder: 'comment.description',
      controlsConfig: [
        {value: mockComment ? mockComment.description : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'comment.validationMessage.descriptionRequired'}
      ]
    },
    commentRelatedFindings: {
      fieldName: 'commentRelatedFindings',
      type: 'text',
      labelKey: 'comment.relatedFindings.label',
      placeholder: 'comment.relatedFindingsPlaceholder',
      controlsConfig: [
        {value: mockComment ? mockComment.relatedFindings : [], disabled: false},
        []
      ],
      errors: [
        {errorCode: 'required', translationKey: 'finding.validationMessage.relatedFindings'}
      ]
    }
  },
  options: [
    {
      headerLabelKey: 'comment.create.header',
      buttonKey: 'global.action.save',
      accentColor: 'info',
      additionalData: []
    },
  ]
};
