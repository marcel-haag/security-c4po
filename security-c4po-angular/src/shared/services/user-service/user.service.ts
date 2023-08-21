import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {User} from '../../models/user.model';
import {from, Observable, of, Subscriber} from 'rxjs';
import {KeycloakService} from 'keycloak-angular';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private keycloakService: KeycloakService) {
  }

  private static createHttpHeadersWithContentType(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private createHttpOptions(): Observable<any> {
    return this.getToken().pipe(
      // create HttpHeaders
      map((token: string): HttpHeaders => {
        return UserService.createHttpHeadersWithContentType(token);
      }),
      // createHttpOptions
      map((httpHeaders: HttpHeaders): { headers } => {
        return {headers: httpHeaders};
      })
    );
  }

  public loadUserProfile(): Observable<User> {
    return from(this.keycloakService.loadUserProfile()) as Observable<User>;
  }

  public logout(): Promise<void> {
    return this.keycloakService.logout();
  }

  public changeUserProperties(user: User): Observable<any> {
    console.warn(user);
    return of(user);
  }

  public redirectToChangePasswordAction(): Promise<void> {
    // https://keycloak.discourse.group/t/integrate-change-password-from-account-console-into-own-webapp/12300
    return this.keycloakService.login({
      action: 'UPDATE_PASSWORD'
    });
  }

  private getToken(): Observable<string> {
    return new Observable((observer: Subscriber<any>): void => {
      this.keycloakService.getToken().then(token => {
        console.warn(token);
        observer.next(token);
        observer.complete();
      }).catch(error => {
        observer.error(error);
        observer.complete();
      });
    });
  }
}
