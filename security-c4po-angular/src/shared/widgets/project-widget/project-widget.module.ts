import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectWidgetComponent} from '@shared/widgets/project-widget/project-widget.component';
import {ReportStateTagModule} from '@shared/widgets/report-state-tag/report-state-tag.module';
import {NbButtonModule, NbCardModule, NbProgressBarModule} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DateTimeFormatPipe} from '@shared/pipes/date-time-format.pipe';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    ProjectWidgetComponent,
    DateTimeFormatPipe
  ],
  imports: [
    CommonModule,
    ReportStateTagModule,
    NbCardModule,
    NbButtonModule,
    NbProgressBarModule,
    TranslateModule,
    FlexLayoutModule,
    FontAwesomeModule
  ],
  exports: [
    DateTimeFormatPipe,
    ProjectWidgetComponent
  ]
})
export class ProjectWidgetModule { }
