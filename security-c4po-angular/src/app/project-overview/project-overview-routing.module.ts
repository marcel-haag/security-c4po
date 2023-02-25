import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Route} from '@shared/models/route.enum';

const routes: Routes = [
  {
    path: Route.OBJECTIVE_OVERVIEW,
    loadChildren: () => import('./project').then(mod => mod.ProjectModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectOverviewRoutingModule { }
