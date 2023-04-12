import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {CommonModule} from '@angular/common';
import {FontAwesomeTestingModule} from '@fortawesome/angular-fontawesome/testing';
import {NbActionsModule, NbMenuModule, NbMenuService, NbSelectModule} from '@nebular/theme';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../common-app.module';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {KeycloakService} from 'keycloak-angular';
import {SESSION_STATE_NAME, SessionState, SessionStateModel} from '@shared/stores/session-state/session-state';
import {User} from '@shared/models/user.model';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';

const DESIRED_STORE_STATE_SESSION: SessionStateModel = {
  userAccount: {
    ...new User('ttt', 'test', 'user', 'default.user@test.de', 'en-US'),
    id: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
  },
  isAuthenticated: true
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ],
      imports: [
        CommonModule,
        NbActionsModule,
        NbSelectModule,
        FontAwesomeTestingModule,
        HttpClientTestingModule,
        NbMenuModule,
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
        {provide: DialogService, useClass: DialogServiceMock},
        NbMenuService,
        KeycloakService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      [SESSION_STATE_NAME]: DESIRED_STORE_STATE_SESSION
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
