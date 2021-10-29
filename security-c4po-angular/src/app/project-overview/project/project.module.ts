import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProjectComponent} from './project.component';
import {LoadingSpinnerComponent} from '@shared/widgets/loading-spinner/loading-spinner.component';
import {NbCardModule, NbLayoutModule, NbSpinnerModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    ProjectComponent,
    LoadingSpinnerComponent
  ],
  exports: [
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: ProjectComponent
    }]),
    NbCardModule,
    NbSpinnerModule,
    FlexLayoutModule,
    NbLayoutModule,
  ]
})
export class ProjectModule {
}
