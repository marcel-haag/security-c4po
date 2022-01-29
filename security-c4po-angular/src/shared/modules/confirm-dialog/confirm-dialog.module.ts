import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmDialogComponent} from '@shared/modules/confirm-dialog/confirm-dialog.component';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    FlexLayoutModule,
    TranslateModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class ConfirmDialogModule { }
