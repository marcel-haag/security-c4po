import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectComponent} from './project.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent
  },
  {
    path: 'pentest',
    loadChildren: () => import('../../pentest-overview/pentest').then(mod => mod.PentestModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
