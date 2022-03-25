import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {NbActionsModule, NbButtonModule, NbCardModule, NbSelectModule} from '@nebular/theme';
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
        TranslateModule
    ]
})
export class HeaderModule {
}
