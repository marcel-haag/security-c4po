import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonAppModule} from '../../../app/common-app.module';
import {NbButtonModule, NbCardModule, NbLayoutModule, NbSelectModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {RetryDialogComponent} from '@shared/modules/retry-dialog/retry-dialog.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    RetryDialogComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    NbCardModule,
    NbButtonModule,
    FlexLayoutModule,
    TranslateModule,
    NbLayoutModule,
    NbSelectModule,
    FontAwesomeModule
  ],
  exports: [
    RetryDialogComponent
  ]
})
export class RetryDialogModule { }
