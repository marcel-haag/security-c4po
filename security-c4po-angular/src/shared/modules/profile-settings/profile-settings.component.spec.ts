import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsComponent } from './profile-settings.component';
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
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';
import {KeycloakService} from 'keycloak-angular';

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;

  beforeEach(async () => {
    const dialogSpy = createSpyObj('NbDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        ProfileSettingsComponent
      ],
      imports: [
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
        NgxsModule.forRoot([SessionState]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NbDialogRef, useValue: dialogSpy},
        KeycloakService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsComponent);
    component = fixture.componentInstance;
    // ToDo: fix detectChanges() when from control accessor is defined
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
