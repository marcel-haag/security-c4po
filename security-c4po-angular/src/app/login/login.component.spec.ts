import {ComponentFixture, fakeAsync, inject, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {RouterTestingModule} from '@angular/router/testing';
import {
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbInputModule,
  NbLayoutModule,
} from '@nebular/theme';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ThemeModule} from '../../assets/@theme/theme.module';
import {NgxsModule, Store} from '@ngxs/store';
import {SESSION_STATE_NAME, SessionState, SessionStateModel} from '../../shared/stores/session-state/session-state';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {User} from '../../shared/models/user.model';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotificationService} from '../../shared/services/notification.service';
import {NotificationServiceMock} from '../../shared/services/notification.service.mock';
import {KeycloakService} from 'keycloak-angular';

const DESIRED_STORE_STATE_SESSION: SessionStateModel = {
  userAccount: {
    ...new User('ttt', 'test', 'user', 'default.user@test.de', 'en-US'),
    id: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
  },
  isAuthenticated: true
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let store: Store;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NbCardModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbLayoutModule,
        ThemeModule.forRoot(),
        NbFormFieldModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([SessionState]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        KeycloakService,
        {provide: NotificationService, useValue: new NotificationServiceMock()}
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([Store], (inStore: Store) => {
    store = inStore;
    store.reset({
      ...store.snapshot(),
      [SESSION_STATE_NAME]: DESIRED_STORE_STATE_SESSION
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
