import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {NbActionsModule, NbButtonModule, NbCardModule} from '@nebular/theme';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FlexLayoutModule} from '@angular/flex-layout';

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
    FlexLayoutModule
  ]
})
export class HeaderModule {
}
