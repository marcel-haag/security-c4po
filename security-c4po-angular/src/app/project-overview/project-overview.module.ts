import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectOverviewComponent} from './project-overview.component';
import {ProjectOverviewRoutingModule} from './project-overview-routing.module';
import {NbButtonModule, NbCardModule, NbProgressBarModule, NbSpinnerModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {DateTimeFormatPipe} from '@shared/pipes/date-time-format.pipe';
import {ProjectDialogModule} from '@shared/modules/project-dialog/project-dialog.module';
import {CommonAppModule} from '../common-app.module';

@NgModule({
  declarations: [
    ProjectOverviewComponent,
    DateTimeFormatPipe,
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbSpinnerModule,
    NbProgressBarModule,
    ProjectOverviewRoutingModule,
    FlexLayoutModule,
    FontAwesomeModule,
    TranslateModule,
    ProjectDialogModule,
    CommonAppModule
  ]
})
export class ProjectOverviewModule {
}
