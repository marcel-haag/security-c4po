import {NgxsModule, Store} from '@ngxs/store';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient} from '@angular/common/http';
import {SESSION_STATE_NAME, SessionState, SessionStateModel} from './session-state';
import {User} from '../../models/user.model';
import {InitSession, UpdateUser} from './session-state.actions';

const INITIAL_STORE_STATE_SESSION: SessionStateModel = {
  userAccount: {
    ...new User(),
    id: ''
  },
  isAuthenticated: false
};

const DESIRED_STORE_STATE_SESSION: SessionStateModel = {
  userAccount: {
    ...new User('ttt', 'test', 'user', 'default.user@test.de', 'en-US'),
    id: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
  },
  isAuthenticated: true
};

describe('SessionState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NgxsModule.forRoot([SessionState]),
      ],
      providers: []
    });
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      [SESSION_STATE_NAME]: DESIRED_STORE_STATE_SESSION
    });
  });

  it('should contain store for SESSION_STATE_NAME', (done) => {
    store.selectSnapshot(state => {
      expect(state[SESSION_STATE_NAME]).toBeTruthy();
      done();
    });
  });

  describe('SelectorTests', () => {
    describe('userAccount', () => {
      it('should return userAccount', () => {
        const user = store.selectSnapshot(SessionState.userAccount);
        expect(user).toBeTruthy();
      });
    });
    describe('isAuthenticated', () => {
      it('should return isAuthenticated', () => {
        const isAuthenticated = store.selectSnapshot(SessionState.isAuthenticated);
        expect(isAuthenticated).toBeTruthy();
      });
    });
  });

  describe('ActionTests', () => {
    describe('InitSessionState', () => {
      it('should initialize default state', () => {
        store.dispatch(new InitSession());
        const currentState = store.selectSnapshot(SessionState);
        expect(currentState).toBeTruthy();
      });
    });
    describe('UpdateUser', () => {
      it('should update user', fakeAsync(() => {
        const newUser = {
          ...new User('ttt', 'test', 'user', 'default.user@test.de', 'en-US'),
          id: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
        };
        store.dispatch(new UpdateUser(newUser));
        tick();
        const currentUser = store.selectSnapshot(SessionState.userAccount);
        expect(currentUser).toEqual(newUser);
      }));
      it('should force update user', fakeAsync(() => {
        const newUser = {
          ...new User('ttt', 'test', 'user', 'default.user@test.de', 'en-US'),
          id: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
        };
        store.dispatch(new UpdateUser(newUser, true));
        tick();
        const currentUser = store.selectSnapshot(SessionState.userAccount);
        expect(currentUser).toEqual(newUser);
      }));
    });
  });
});
