import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {UpdateIsAuthenticated, UpdateUser} from '../stores/session-state/session-state.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService extends KeycloakAuthGuard implements CanActivate {
  constructor(
    public readonly router: Router,
    protected keycloakService: KeycloakService,
    private readonly store: Store) {
    super(router, keycloakService);
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
}
