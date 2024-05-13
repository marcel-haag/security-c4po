import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmDialogComponent} from '@shared/modules/confirm-dialog/confirm-dialog.component';
import {NbButtonModule, NbCardModule, NbLayoutModule, NbSelectModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {CommonAppModule} from '../../../app/common-app.module';

@NgModule({
    declarations: [
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        CommonAppModule,
        NbCardModule,
        NbButtonModule,
        FlexLayoutModule,
        TranslateModule,
        NbLayoutModule,
        NbSelectModule
    ]
})
export class ConfirmDialogModule {
}
