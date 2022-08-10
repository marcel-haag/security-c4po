import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProjectComponent} from './project.component';
import {NbCardModule, NbLayoutModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {ProjectDialogModule} from '@shared/modules/project-dialog/project-dialog.module';
import {ProjectRoutingModule} from './project-routing.module';
import {PentestOverviewModule} from '../../pentest-overview';

@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbLayoutModule,
    RouterModule.forChild([{
      path: '',
      component: ProjectComponent
    }]),
    ProjectRoutingModule,
    TranslateModule,
    FlexLayoutModule,
    ProjectDialogModule,
    PentestOverviewModule
  ],
  exports: [
    ProjectComponent
  ]
})
export class ProjectModule {
}
