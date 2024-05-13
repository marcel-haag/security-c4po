import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from '../shared/guards/auth-guard.service';
import {Route} from '@shared/models/route.enum';

export const START_PAGE = Route.PROJECT_OVERVIEW;

const routes: Routes = [
  {
    path: Route.HOME,
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: Route.PROJECT_OVERVIEW,
    loadChildren: () => import('./project-overview').then(mod => mod.ProjectOverviewModule),
    canActivate: [AuthGuardService]
  },
  {
    path: Route.OBJECTIVE_OVERVIEW,
    loadChildren: () => import('./project-overview/project').then(mod => mod.ProjectModule),
    canActivate: [AuthGuardService]
  },
  {
    path: Route.PENTEST_OBJECTIVE,
    loadChildren: () => import('./pentest').then(mod => mod.PentestModule),
    canActivate: [AuthGuardService]
  },
  // ToDo: Remove after default Keycloak login mask got reworked
  /*{
    path: 'login',
    loadChildren: () => import('./login').then(mod => mod.LoginModule),
    canActivate: [LoginGuardService]
  },*/
  {path: '**', redirectTo: START_PAGE},
  {path: '', redirectTo: START_PAGE, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
