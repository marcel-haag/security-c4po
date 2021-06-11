import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {NbLayoutModule, NbThemeModule} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from './common-app.module';
import {HttpClient} from '@angular/common/http';
import {ThemeModule} from '../assets/@theme/theme.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SessionState} from '../shared/stores/session-state/session-state';
import {NgxsModule} from '@ngxs/store';
import {HeaderModule} from './header/header.module';
import {KeycloakService} from 'keycloak-angular';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NbThemeModule.forRoot(),
        NbLayoutModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NbEvaIconsModule,
        ThemeModule,
        HeaderModule,
        NgxsModule.forRoot([SessionState]),
        HttpClientTestingModule
      ],
      providers: [
        KeycloakService
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'security-c4po-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('security-c4po-angular');
  });
});
