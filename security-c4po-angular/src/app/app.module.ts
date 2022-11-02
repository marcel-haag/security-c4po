import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  NbLayoutModule,
  NbToastrModule,
  NbIconModule,
  NbCardModule,
  NbButtonModule,
  NbSelectModule,
  NbThemeModule,
  NbOverlayContainerAdapter,
  NbDialogModule,
} from '@nebular/theme';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpLoaderFactory} from './common-app.module';
import {RouterModule} from '@angular/router';
import {FaConfig, FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';
import {environment} from '../environments/environment';
import {NotificationService} from '@shared/services/notification.service';
import {ThemeModule} from '@assets/@theme/theme.module';
import {HeaderModule} from './header/header.module';
import {HomeModule} from './home/home.module';
import {KeycloakService} from 'keycloak-angular';
import {httpInterceptorProviders} from '@shared/interceptors';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxsLoggerPluginModule} from '@shared/stores/plugins/store-logger-plugin';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {CustomOverlayContainer} from '@shared/modules/custom-overlay-container.component';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NbLayoutModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbDialogModule.forRoot(),
    NbThemeModule.forRoot(),
    NbToastrModule.forRoot(), // used for notification service
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ThemeModule.forRoot(),
    NbSelectModule,
    NgxsModule.forRoot([SessionState, ProjectState], {developmentMode: !environment.production}),
    NgxsLoggerPluginModule.forRoot({developmentMode: !environment.production}),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HeaderModule,
    HomeModule,
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
    NotificationService,
    DialogService,
    {provide: NbOverlayContainerAdapter, useClass: CustomOverlayContainer}
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
