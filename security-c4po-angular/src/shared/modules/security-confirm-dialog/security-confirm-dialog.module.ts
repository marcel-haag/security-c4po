import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonAppModule} from '../../../app/common-app.module';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbInputModule, NbLayoutModule, NbSelectModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {SecurityConfirmDialogComponent} from '@shared/modules/security-confirm-dialog/security-confirm-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    SecurityConfirmDialogComponent
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
    NbInputModule,
    NbFormFieldModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SecurityConfirmDialogComponent
  ]
})
export class SecurityConfirmDialogModule { }
