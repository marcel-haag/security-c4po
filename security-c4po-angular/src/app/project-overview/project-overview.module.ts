import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectOverviewComponent} from './project-overview.component';
import {ProjectOverviewRoutingModule} from './project-overview-routing.module';
import {
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbInputModule,
  NbLayoutModule,
  NbProgressBarModule,
  NbSelectModule
} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {DateTimeFormatPipe} from '@shared/pipes/date-time-format.pipe';
import {ProjectDialogModule} from '@shared/modules/project-dialog/project-dialog.module';
import {CommonAppModule} from '../common-app.module';
import {ConfirmDialogModule} from '@shared/modules/confirm-dialog/confirm-dialog.module';
import {SecurityConfirmDialogModule} from '@shared/modules/security-confirm-dialog/security-confirm-dialog.module';
import {RouterModule} from '@angular/router';
import {ReportStateTagModule} from '@shared/widgets/report-state-tag/report-state-tag.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    ProjectOverviewComponent,
    DateTimeFormatPipe
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    RouterModule.forChild([{
      path: '',
      component: ProjectOverviewComponent
    }]),
    NbCardModule,
    NbButtonModule,
    NbProgressBarModule,
    ProjectOverviewRoutingModule,
    FlexLayoutModule,
    FontAwesomeModule,
    TranslateModule,
    ProjectDialogModule,
    ConfirmDialogModule,
    ReportStateTagModule,
    SecurityConfirmDialogModule,
    NbLayoutModule,
    NbInputModule,
    NbFormFieldModule,
    ReactiveFormsModule,
    NbSelectModule
  ]
})
export class ProjectOverviewModule {
}
