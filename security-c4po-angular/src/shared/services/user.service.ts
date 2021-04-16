import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user.model';
import {from, Observable, Subscriber} from 'rxjs';
import {Store} from '@ngxs/store';
import {KeycloakService} from 'keycloak-angular';
import {map} from 'rxjs/operators';

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
