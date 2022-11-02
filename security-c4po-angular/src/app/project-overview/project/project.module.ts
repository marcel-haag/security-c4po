import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProjectComponent} from './project.component';
import {NbCardModule, NbLayoutModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {ProjectRoutingModule} from './project-routing.module';
import {ObjectiveOverviewModule} from '../../objective-overview';
import {CommonAppModule} from '../../common-app.module';

@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    NbCardModule,
    NbLayoutModule,
    RouterModule.forChild([{
      path: '',
      component: ProjectComponent
    }]),
    ProjectRoutingModule,
    TranslateModule,
    FlexLayoutModule,
    ObjectiveOverviewModule
  ],
  exports: [
    ProjectComponent
  ]
})
export class ProjectModule {
}
