import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbSelectModule,
  NbUserModule
} from '@nebular/theme';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {ProfileSettingsModule} from '@shared/modules/profile-settings/profile-settings.module';
import {TutorialDialogModule} from '@shared/modules/tutorial-dialog/tutorial-dialog.module';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NbButtonModule,
    FontAwesomeModule,
    NbCardModule,
    NbActionsModule,
    FlexLayoutModule,
    NbSelectModule,
    TranslateModule,
    NbUserModule,
    NbContextMenuModule,
    ProfileSettingsModule,
    TutorialDialogModule
  ],
  providers: [
  ]
})
export class HeaderModule {
}
