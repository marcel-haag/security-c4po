import {User} from '../../models/user.model';
import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {TranslateService} from '@ngx-translate/core';
import {FetchUser, InitSession, ResetSession, UpdateIsAuthenticated, UpdateUser, UpdateUserSettings} from './session-state.actions';
import deepEqual from 'deep-equal';
import moment from 'moment';
import {UserService} from '../../services/user.service';

export interface SessionStateModel {
  userAccount: User;
  isAuthenticated: boolean;
}

export const SESSION_STATE_NAME = 'session';
export const SESSION_STORAGE_KEY_USER = 'user';

@State<SessionStateModel>({
  name: SESSION_STATE_NAME,
  defaults: {
    userAccount: null,
    isAuthenticated: false
  }
})
@Injectable()
export class SessionState {
  constructor(@Inject(LOCALE_ID) private readonly localeId: string,
              private readonly userService: UserService,
              private readonly translateService: TranslateService) {
  }

  @Selector()
  static userAccount(state: SessionStateModel): User {
    return state.userAccount;
  }

  @Selector()
  static isAuthenticated(state: SessionStateModel): boolean {
    return state.isAuthenticated;
  }

  @Action(InitSession)
  initSessionState(ctx: StateContext<SessionStateModel>): void {
    ctx.setState({
      userAccount: null,
      isAuthenticated: false
    });
  }

  @Action(ResetSession)
  resetSession(ctx: StateContext<SessionStateModel>): void {
    this.deleteSessionStorage();
    ctx.dispatch(new InitSession());
  }

  @Action(FetchUser)
  fetchUser(ctx: StateContext<SessionStateModel>): void {
    this.userService.loadUserProfile().subscribe({
      next: (user: User): void => {
        ctx.dispatch(new UpdateUser(user, true));
      },
      error: (err) => console.error('Failed to load UserProfile', err)
    });
  }

  @Action(UpdateUser)
  updateUser(ctx: StateContext<SessionStateModel>, {user, force}: UpdateUser): void {
    const state = ctx.getState();
    if (force || !deepEqual(user, state.userAccount)) {
      ctx.patchState({
        userAccount: user
      });
      // write to sessionStorage
      this.setSessionStorage(user);
      ctx.dispatch(new UpdateUserSettings(user));
    }
  }

  // TODO: Should be connected KeyCloak
  @Action(UpdateIsAuthenticated)
  updateIsAuthenticated(ctx: StateContext<SessionStateModel>, {authenticated}: UpdateIsAuthenticated): void {
    ctx.patchState({isAuthenticated: authenticated});
  }

  @Action(UpdateUserSettings)
  updateUserSettings(ctx: StateContext<SessionStateModel>, {user}: UpdateUserSettings): void {
    if (user) {
      if (user.interfaceLang) {
        const newLanguage = user.interfaceLang;
        this.translateService.use(newLanguage);
        moment.locale(newLanguage);
      }
    }
  }

  private setSessionStorage(user: User): void {
    // TODO: https://www.ngxs.io/plugins/storage
    if (user) {
      sessionStorage.setItem(SESSION_STORAGE_KEY_USER, JSON.stringify(user));
    }
  }

  private deleteSessionStorage(): void {
    // TODO: https://www.ngxs.io/plugins/storage
    sessionStorage.removeItem(SESSION_STORAGE_KEY_USER);
  }
}
