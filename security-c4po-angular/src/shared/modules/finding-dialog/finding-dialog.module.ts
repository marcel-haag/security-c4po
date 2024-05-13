import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindingDialogComponent} from '@shared/modules/finding-dialog/finding-dialog.component';
import {
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbInputModule,
  NbSelectModule,
  NbTagModule
} from '@nebular/theme';
import {FindingDialogService} from '@shared/modules/finding-dialog/service/finding-dialog.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {CommonAppModule} from '../../../app/common-app.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        FindingDialogComponent
    ],
    imports: [
        CommonModule,
        CommonAppModule,
        NbCardModule,
        NbButtonModule,
        NbFormFieldModule,
        NbInputModule,
        FlexLayoutModule,
        FontAwesomeModule,
        TranslateModule,
        NbSelectModule,
        NbTagModule,
        ReactiveFormsModule,
    ],
    providers: [
        FindingDialogService,
    ]
})
export class FindingDialogModule {
}
