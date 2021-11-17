import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectOverviewComponent} from './project-overview.component';
import {ProjectOverviewRoutingModule} from './project-overview-routing.module';
import {NbButtonModule, NbCardModule, NbDialogService, NbProgressBarModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {DateTimeFormatPipe} from '@shared/pipes/date-time-format.pipe';
import {ProjectModule} from './project';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogModule} from '@shared/modules/project-dialog/project-dialog.module';

@NgModule({
  declarations: [
    ProjectOverviewComponent,
    DateTimeFormatPipe
  ],
  imports: [
    CommonModule,
    ProjectOverviewRoutingModule,
    NbCardModule,
    NbButtonModule,
    FlexLayoutModule,
    FontAwesomeModule,
    TranslateModule,
    NbProgressBarModule,
    ProjectModule,
    ProjectDialogModule
  ],
  providers: [
    DialogService,
    NbDialogService
  ]
})
export class ProjectOverviewModule {
}
