import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from '../shared/guards/auth-guard.service';
import {LoginGuardService} from '../shared/guards/login-guard.service';

export const START_PAGE = 'home';
export const FALLBACK_PAGE = 'home';

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
  {
    path: 'login',
    loadChildren: () => import('./login').then(mod => mod.LoginModule),
    canActivate: [LoginGuardService]
  },
  {path: '**', redirectTo: START_PAGE},
  {path: '', redirectTo: START_PAGE, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
