import {AbstractControl, ValidatorFn} from '@angular/forms';

export function acceptableInputValidator(confirmString: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    control.value === confirmString
      ? null : {wrongConfirmString: control.value};
}
