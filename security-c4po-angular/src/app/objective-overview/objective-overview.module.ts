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
import {LoadingSpinnerComponent} from '@shared/widgets/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    ObjectiveHeaderComponent,
    ObjectiveCategoriesComponent,
    ObjectiveTableComponent,
    // LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbCardModule,
    NbMenuModule.forRoot(),
    NbButtonModule,
    // nbTooltip crashes app right now if used in component,
    // workaround: use title in html for now
    NbTooltipModule,
    NbTreeGridModule,
    TranslateModule,
    StatusTagModule,
    FindigWidgetModule,
    RouterModule,
    NbMenuModule,
    FormsModule,
    NbListModule,
    FontAwesomeModule,
    FlexLayoutModule,
    NbActionsModule
  ],
  exports: [
    ObjectiveHeaderComponent,
    ObjectiveCategoriesComponent,
    ObjectiveTableComponent,
    // LoadingSpinnerComponent
  ]
})
export class ObjectiveOverviewModule {
}
