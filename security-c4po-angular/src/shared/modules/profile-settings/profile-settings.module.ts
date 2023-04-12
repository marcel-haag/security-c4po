import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileSettingsComponent} from '@shared/modules/profile-settings/profile-settings.component';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ReactiveFormsModule} from '@angular/forms';
import { PasswordInputFromComponent } from './password-input-from/password-input-from.component';

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    PasswordInputFromComponent
  ],
    imports: [
        CommonModule,
        NbCardModule,
        TranslateModule,
        FlexLayoutModule,
        NbButtonModule,
        FontAwesomeModule,
        NbSelectModule,
        ReactiveFormsModule,
        NbFormFieldModule,
        NbInputModule,
        NbRadioModule,
        NbIconModule
    ],
  exports: [
    ProfileSettingsComponent
  ]
})
export class ProfileSettingsModule {
}
