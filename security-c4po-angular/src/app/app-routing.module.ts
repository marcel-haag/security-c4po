import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from '../shared/guards/auth-guard.service';

export const START_PAGE = 'home';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard').then(mod => mod.DashboardModule),
    canActivate: [AuthGuardService]
  },
  // ToDo: Exchange default Keycloak login with self made login
  /*{
    path: 'login',
    loadChildren: () => import('./login').then(mod => mod.LoginModule),
    canActivate: [LoginGuardService]
  },*/
  {path: '**', redirectTo: START_PAGE},
  {path: '', redirectTo: START_PAGE, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
