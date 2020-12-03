import {User} from '../../models/user.model';

export class InitSession {
  static readonly type = '[Session] InitSession';
}

// resetLocalUser
export class ResetSession {
  static readonly type = '[Session] ResetSession';
}

export class UpdateUser {
  static readonly type = '[Session] UpdateUser';

  /**
   * Updates the current user-account, if user isn't equal!
   * @param user of type User (user can be null if no user is logged in)
   * @param force if update should be forced!
   */
  constructor(public user: User, public force = false) {
  }
}

// updateUserSpecificSettings
export class UpdateUserSettings {
  static readonly type = '[Session] UpdateUserSettings';

  constructor(public user: User) {
  }
}

export class UpdateIsAuthenticated {
  static readonly type = '[Session] UpdateIsAuthenticated';

  constructor(public authenticated: boolean) {
  }
}
