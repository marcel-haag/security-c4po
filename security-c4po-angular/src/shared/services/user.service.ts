import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user.model';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {SessionState} from '../stores/session-state/session-state';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private store: Store) {
  }

  private static createHttpHeadersWithContentType(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getCurrentAuthenticatedUser(): Observable<User> {
    return this.store.select(SessionState.userAccount);
  }
}
