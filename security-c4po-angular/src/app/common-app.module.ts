import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';
import {NotificationService} from '../shared/services/notification.service';
import {NbToastrModule} from '@nebular/theme';
import {ThemeModule} from '../assets/@theme/theme.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbToastrModule, // used for notification service
    FontAwesomeModule,
    FlexLayoutModule,
    ThemeModule.forRoot(),
    FlexModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    HttpClient,
    NotificationService
  ],
  exports: [
    // modules
    MomentModule
  ]
})
export class CommonAppModule {
}
