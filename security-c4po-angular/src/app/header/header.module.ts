import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule, NbMenuModule,
  NbSelectModule,
  NbUserModule
} from '@nebular/theme';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';

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
    NbContextMenuModule
  ],
  providers: [
  ]
})
export class HeaderModule {
}
