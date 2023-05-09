import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialDialogComponent } from './tutorial-dialog.component';
import {NgxGlideModule} from 'ngx-glide';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {NbDialogRef, NbFormFieldModule} from '@nebular/theme';
import {createSpyObj} from '@shared/modules/project-dialog/project-dialog.component.spec';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TutorialDialogComponent', () => {
  let component: TutorialDialogComponent;
  let fixture: ComponentFixture<TutorialDialogComponent>;

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        TutorialDialogComponent
      ],
      imports: [
        NgxGlideModule,
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
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: dialogSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
