import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjectiveHeaderComponent} from './objective-header/objective-header.component';
import {ObjectiveCategoriesComponent} from './objective-categories/objective-categories.component';
import {ObjectiveTableComponent} from './objective-table/objective-table.component';
import {
  NbCardModule,
  NbLayoutModule,
  NbTreeGridModule,
  NbMenuModule,
  NbListModule,
  NbButtonModule,
  NbTooltipModule,
  NbActionsModule
} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';
import {StatusTagModule} from '@shared/widgets/status-tag/status-tag.module';
import {FindigWidgetModule} from '@shared/widgets/findig-widget/findig-widget.module';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonAppModule} from '../common-app.module';
import {ObjectiveOverviewRoutingModule} from './objective-overview-routing.module';
import {ExportReportDialogModule} from '@shared/modules/export-report-dialog/export-report-dialog.module';
import {ProjectDialogModule} from '@shared/modules/project-dialog/project-dialog.module';
import {CommentWidgetModule} from '@shared/widgets/comment-widget/comment-widget.module';

@NgModule({
  declarations: [
    ObjectiveHeaderComponent,
    ObjectiveCategoriesComponent,
    ObjectiveTableComponent,
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    // nbTooltip crashes app right now if used in component,
    // workaround: use title in html for now
    NbTooltipModule,
    NbTreeGridModule,
    TranslateModule,
    StatusTagModule,
    RouterModule,
    FormsModule,
    NbListModule,
    FontAwesomeModule,
    FlexLayoutModule,
    NbActionsModule,
    ExportReportDialogModule,
    ProjectDialogModule,
    ObjectiveOverviewRoutingModule,
    // Table Widgets
    FindigWidgetModule,
    CommentWidgetModule,
    NbMenuModule
  ],
  exports: [
    ObjectiveHeaderComponent,
    ObjectiveCategoriesComponent,
    ObjectiveTableComponent,
  ]
})
export class ObjectiveOverviewModule {
}
