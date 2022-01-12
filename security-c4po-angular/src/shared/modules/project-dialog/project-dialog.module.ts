import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {NbButtonModule, NbCardModule, NbDialogService, NbFormFieldModule, NbInputModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    ProjectDialogComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    FlexLayoutModule,
    FontAwesomeModule,
    TranslateModule,
    ReactiveFormsModule,
    NbFormFieldModule,
    NbInputModule,
  ],
  providers: [
    DialogService,
    NbDialogService
  ],
  entryComponents: [
    ProjectDialogComponent
  ]
})
export class ProjectDialogModule { }
