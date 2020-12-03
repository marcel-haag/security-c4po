import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {SessionState} from '../stores/session-state/session-state';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly store: Store) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.isAuthenticated()
      .pipe(
        map((canAccess: boolean) => {
          if (canAccess) {
            return canAccess;
          } else {
            this.router.navigate(['/login']);
          }
        })
      );
  }

  /**
   * @return boolean
   */
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
  }
}
