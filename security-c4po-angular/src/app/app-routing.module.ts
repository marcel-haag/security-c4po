import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from '../shared/guards/auth-guard.service';

export const START_PAGE = 'projects';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'projects',
    loadChildren: () => import('./project-overview').then(mod => mod.ProjectOverviewModule),
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
