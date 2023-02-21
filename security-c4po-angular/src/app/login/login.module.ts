import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../common-app.module';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '@shared/services/toaster-service/notification.service';
import {LoginRoutingModule} from './login-routing.module';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbInputModule, NbLayoutModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ThemeModule} from '@assets/@theme/theme.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NbCardModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NbInputModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbLayoutModule,
    NbFormFieldModule
  ], providers: [
    NotificationService
  ]
})
export class LoginModule {
}
