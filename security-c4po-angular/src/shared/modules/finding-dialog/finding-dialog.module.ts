import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FindingDialogComponent} from '@shared/modules/finding-dialog/finding-dialog.component';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {NbButtonModule, NbCardModule, NbDialogService, NbFormFieldModule, NbInputModule, NbSelectModule, NbTagModule} from '@nebular/theme';
import {FindingDialogService} from '@shared/modules/finding-dialog/service/finding-dialog.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    FindingDialogComponent
  ],
    imports: [
        CommonModule,
        NbCardModule,
        NbButtonModule,
        NbFormFieldModule,
        NbInputModule,
        FlexLayoutModule,
        FontAwesomeModule,
        TranslateModule,
        ReactiveFormsModule,
        NbSelectModule,
        NbTagModule
    ],
  providers: [
    DialogService,
    FindingDialogService,
    NbDialogService
  ],
  entryComponents: [
    FindingDialogComponent
  ]
})
export class FindingDialogModule { }
