import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../models/user.model';
import {from, Observable, of, Subscriber} from 'rxjs';
import {Store} from '@ngxs/store';
import {KeycloakService} from 'keycloak-angular';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Route} from '@shared/models/route.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private keycloakService: KeycloakService,
              private store: Store) {
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

  // ToDo: Change update profile propterties OR ...
  // ...In our angular application, best way to change password was to create “button” with “hardcoded” link to:
  // https://keycloakUrl/realms/myrealm/protocol/openid-connect/auth 58
  // ?response_type=code
  // &client_id=myclient
  // &redirect_uri=myAppUrl
  // &kc_action=UPDATE_PASSWORD
  // ToDo: Or use API
  // https://stackoverflow.com/questions/33910615/is-there-an-api-call-for-changing-user-password-on-keycloak

  // ToDo: https://www.keycloak.org/docs/latest/server_development/
  public changeUserProperties(): Observable<any> {
    // ToDo: There is a kc_action parameter available in keycloak to let application force required actions.
    /*../realms/myrealm/protocol/openid-connect/auth
        ?response_type=code
        &client_id=myclient
        &redirect_uri=https://myclient.com
        &kc_action=update_profile*/
    return of();
  }

  // ToDo: https://keycloak.discourse.group/t/integrate-change-password-from-account-console-into-own-webapp/12300
  public changePassword(): Observable<any> {
    // ToDo: To force (or allow) a password update, use kc_action=UPDATE_PASSWORD
    /*../realms/myrealm/protocol/openid-connect/auth
        ?response_type=code
        &client_id=myclient
        &redirect_uri=https://myclient.com
        &kc_action=update_profile*/
    return of();
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
