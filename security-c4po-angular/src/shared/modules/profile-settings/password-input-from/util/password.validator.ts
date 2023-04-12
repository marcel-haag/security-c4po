import {AbstractControl, ValidationErrors} from '@angular/forms';

/**
 *  passwordValidator validates the password based on 3 conditions:
 *    - newPassword === confirmNewPassword
 *    - MIN_PASSWORD_LENGTH <= newPassword
 *    - oldPassword is NOT empty
 *
 * @param formGroup AbstractControl containing [oldPassword, newPassword, confirmPassword]
 */
export function passwordValidator(formGroup: AbstractControl): ValidationErrors | null {
  const oldPasswordCtrl = formGroup.get('oldPassword');
  const newPasswordCtrl = formGroup.get('newPassword');
  const confirmNewPasswordCtrl = formGroup.get('confirmNewPassword');
  if (newPasswordCtrl.value !== confirmNewPasswordCtrl.value) {
    return {passwordsDoNotMatch: true};
  } else if (oldPasswordCtrl.value === '') {
    oldPasswordCtrl.setErrors({oldPasswordEmpty: true});
    return {oldPasswordEmpty: true};
  } else {
    return null;
  }
}
