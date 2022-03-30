import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectOverviewComponent} from './project-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectOverviewComponent
  },
  {
    path: 'id',
    loadChildren: () => import('./project').then(mod => mod.ProjectModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectOverviewRoutingModule { }
