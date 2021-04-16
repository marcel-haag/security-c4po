import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  NbLayoutModule,
  NbToastrModule,
  NbIconModule, NbCardModule, NbButtonModule,
} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpLoaderFactory} from './common-app.module';
import {RouterModule} from '@angular/router';
import {FaConfig, FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '../shared/stores/session-state/session-state';
import {environment} from '../environments/environment';
import {NotificationService} from '../shared/services/notification.service';
import {ThemeModule} from '@assets/@theme/theme.module';
import {HeaderModule} from './header/header.module';
import {HomeModule} from './home/home.module';
import {KeycloakService} from 'keycloak-angular';
import {httpInterceptorProviders} from '../shared/interceptors';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FontAwesomeModule,
    NbToastrModule.forRoot(), // used for notification service
    BrowserAnimationsModule,
    ThemeModule.forRoot(),
    NbLayoutModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbEvaIconsModule,
    NgxsModule.forRoot([SessionState], {developmentMode: !environment.production}),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HeaderModule,
    HomeModule
  ],
  providers: [
    HttpClient,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    },
    KeycloakService,
    httpInterceptorProviders,
    NotificationService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  constructor(library: FaIconLibrary, faConfig: FaConfig) {
    library.addIconPacks(fas, far);
    faConfig.defaultPrefix = 'fas';
  }
}

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return async (): Promise<any> => {
    try {
      await keycloak.init({
        config: {
          url: environment.keycloakURL,
          realm: environment.keycloakrealm,
          clientId: environment.keycloakclientId
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
          // flow: 'implicit'
        },
        loadUserProfileAtStartUp: false,
        enableBearerInterceptor: true,
        bearerExcludedUrls: [
          '/assets',
          '/clients/public'
        ]
      });
    } catch (error) {
      // console.error(error);
    }
  };
}
