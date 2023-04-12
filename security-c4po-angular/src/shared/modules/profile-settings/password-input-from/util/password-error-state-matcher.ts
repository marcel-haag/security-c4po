import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

export class PasswordErrorStateMatcher {
  public passwordsDoNotMatch = true;
  public userServiceError;

  constructor(userServiceError: BehaviorSubject<boolean>) {
    this.userServiceError = userServiceError;
  }

  /**
   * @return true if new and confirm password do not match.
   */
  isErrorState(ctrl: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const passwordCtrl = form.control.get('newPassword');
    this.passwordsDoNotMatch = passwordCtrl.value !== ctrl.value;
    return this.passwordsDoNotMatch || this.userServiceError.value;
  }
}

export class OldPasswordEmptyError {
  public oldPasswordEmpty = true;

  /**
   * @return true if old password is empty and new password is not.
   */
  isErrorState(ctrl: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const passwordCtrl = form.control.get('newPassword');
    this.oldPasswordEmpty = passwordCtrl.value.length !== 0 && ctrl.value.length === 0;
    return this.oldPasswordEmpty;
  }
}
