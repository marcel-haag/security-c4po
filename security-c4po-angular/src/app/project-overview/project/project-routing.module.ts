import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Route} from '@shared/models/route.enum';

const routes: Routes = [
  {
    path: Route.PENTEST_OBJECTIVE,
    loadChildren: () => import('../../pentest').then(mod => mod.PentestModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
