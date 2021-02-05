import { Injectable } from '@angular/core';
import {Store} from '@ngxs/store';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {SessionState} from '../stores/session-state/session-state';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(
    private router: Router,
    private store: Store) {
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
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

  /**
   * @return state of authentication
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

