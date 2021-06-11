import { Injectable } from '@angular/core';
import {Store} from '@ngxs/store';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {SessionState} from '../stores/session-state/session-state';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {UpdateIsAuthenticated, UpdateUser} from '../stores/session-state/session-state.actions';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService extends KeycloakAuthGuard implements CanActivate {
  constructor(
    public readonly router: Router,
    protected keycloakAngular: KeycloakService,
    private readonly store: Store) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login()
          .catch(e => console.error(e));
        return reject(false);
      }

      const requiredRoles: string[] = route.data.roles;
      if (!requiredRoles || requiredRoles.length === 0) {
        this.store.dispatch(new UpdateIsAuthenticated(true));
        this.store.dispatch(new UpdateUser(route.data.user, true));
        return resolve(true);
      } else {
        if (!this.roles || this.roles.length === 0) {
          this.store.dispatch(new UpdateIsAuthenticated(false));
          this.store.dispatch(new UpdateUser(null, true));
          resolve(false);
        }
        resolve(requiredRoles.every(role => this.roles.indexOf(role) > -1));
      }
    });
  }

/*  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isAuthenticated().pipe(
      tap((canAccess: boolean) => {
        if (canAccess) {
          this.router.navigate(['']).then();
        }
      }),
      // return true if login should be loaded (=> invert)
      map((canAccess: boolean) => !canAccess)
    );
  }

  /!**
   * @return state of authentication
   *!/
  private isAuthenticated(): Observable<boolean> {
    // ToDo: Should check from Authentication Provider
    return of(this.store.selectSnapshot(SessionState.isAuthenticated))
      .pipe(
        map((isLoggedIn: boolean) => {
          return isLoggedIn;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }*/
}

