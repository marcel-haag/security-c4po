import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbInputModule, NbSelectModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {CommonAppModule} from '../../../app/common-app.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    ProjectDialogComponent
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
        ReactiveFormsModule,
        NbSelectModule,
    ],
  providers: [
    ProjectDialogService,
  ],
  entryComponents: [
    ProjectDialogComponent
  ]
})
export class ProjectDialogModule {
}
