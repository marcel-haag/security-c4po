import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectOverviewComponent} from './project-overview.component';
import {ProjectOverviewRoutingModule} from './project-overview-routing.module';
import {NbButtonModule, NbCardModule, NbProgressBarModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {DateTimeFormatPipe} from '@shared/pipes/date-time-format.pipe';
import {ProjectModule} from './project';

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
    ProjectModule
  ]
})
export class ProjectOverviewModule {
}
