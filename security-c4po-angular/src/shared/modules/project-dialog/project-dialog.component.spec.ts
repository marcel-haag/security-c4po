import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProjectDialogComponent} from './project-dialog.component';
import {CommonModule} from '@angular/common';
import {
  NB_DIALOG_CONFIG,
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbFormFieldModule,
  NbInputModule,
  NbLayoutModule
} from '@nebular/theme';
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
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {Project} from '@shared/models/project.model';
import Mock = jest.Mock;

describe('ProjectDialogComponent', () => {
  let component: ProjectDialogComponent;
  let fixture: ComponentFixture<ProjectDialogComponent>;

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

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
        {provide: NbDialogRef, useValue: dialogSpy},
        {provide: NB_DIALOG_CONFIG, useValue: mockedProjectDialogData}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideProvider(NB_DIALOG_CONFIG, {useValue: mockedProjectDialogData});
    fixture = TestBed.createComponent(ProjectDialogComponent);
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

export const mockProject: Project = {
  id: '11-22-33',
  title: 'Test Project',
  client: 'Testclient',
  tester: 'Testpentester',
  summary: '',
  createdAt: new Date(),
  testingProgress: 0,
  createdBy: 'UID-11-12-13'
};

export const mockedProjectDialogData = {
  form: {
    projectTitle: {
      fieldName: 'projectTitle',
      type: 'text',
      labelKey: 'project.title.label',
      placeholder: 'project.title',
      controlsConfig: [
        {value: mockProject ? mockProject.title : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'project.validationMessage.titleRequired'}
      ]
    },
    projectClient: {
      fieldName: 'projectClient',
      type: 'text',
      labelKey: 'project.client.label',
      placeholder: 'project.client',
      controlsConfig: [
        {value: mockProject ? mockProject.client : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'project.validationMessage.clientRequired'}
      ]
    },
    projectTester: {
      fieldName: 'projectTester',
      type: 'text',
      labelKey: 'project.tester.label',
      placeholder: 'project.tester',
      controlsConfig: [
        {value: mockProject ? mockProject.tester : '', disabled: false},
        [Validators.required]
      ],
      errors: [
        {errorCode: 'required', translationKey: 'project.validationMessage.testerRequired'}
      ]
    }
  },
  options: [
    {
      headerLabelKey: 'project.edit.header',
      buttonKey: 'global.action.update',
      accentColor: 'warning'
    },
  ]
};
