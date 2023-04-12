import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors} from '@angular/forms';
import {
  OldPasswordEmptyError,
  PasswordErrorStateMatcher
} from '@shared/modules/profile-settings/password-input-from/util/password-error-state-matcher';
import {passwordValidator} from '@shared/modules/profile-settings/password-input-from/util/password.validator';
import {BehaviorSubject} from 'rxjs';
import {ProfilePasswordFormData} from '@shared/modules/profile-settings/password-input-from/util/profile-password-form-data.model';
import * as FA from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-password-input-from',
  templateUrl: './password-input-from.component.html',
  styleUrls: ['./password-input-from.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputFromComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordInputFromComponent),
      multi: true
    }
  ]
})
export class PasswordInputFromComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  // Emits true if password is strong
  @Output() passwordStrong: EventEmitter<boolean> = new EventEmitter();
  // Handle erros
  @Input() userServiceError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public passwordErrorStateMatcher: PasswordErrorStateMatcher;
  public oldPasswordEmptyError: OldPasswordEmptyError;
  // show the criteria of the new password
  showDetails = false;

  passwordFormGroup: FormGroup;
  // form control elements
  oldPasswordCtrl: AbstractControl;
  newPasswordCtrl: AbstractControl;
  confirmNewPasswordCtrl: AbstractControl;
  // HTML only
  readonly fa = FA;
  showOldPassword = false;
  showNewPasswords = false;

  /**
   * tests value of control for empty-spaces
   * @param control FormControl
   */
  static containsBlankSpaceValidator(control: FormControl): ValidationErrors | null {
    const containsEmptySpacesRegex: RegExp = new RegExp(/\s+/);
    return containsEmptySpacesRegex.test(control.value) ? {passwordContainsBlankSpace: true} : null;
  }

  ngOnInit(): void {
    this.passwordFormGroup = this.fb.group(
      {
        oldPassword: ['', [PasswordInputFromComponent.containsBlankSpaceValidator]],
        newPassword: ['', [PasswordInputFromComponent.containsBlankSpaceValidator]],
        confirmNewPassword: ''
      },
      {validators: [passwordValidator]}
    );
    // get form controls
    this.oldPasswordCtrl = this.passwordFormGroup.get('oldPassword');
    this.newPasswordCtrl = this.passwordFormGroup.get('newPassword');
    this.confirmNewPasswordCtrl = this.passwordFormGroup.get('confirmNewPassword');

    this.passwordErrorStateMatcher = new PasswordErrorStateMatcher(this.userServiceError$);
    this.oldPasswordEmptyError = new OldPasswordEmptyError();
  }

  registerOnChange(fn: any): void {
    this.passwordFormGroup.valueChanges.subscribe(() => {
      fn(this.passwordFormGroup.value);
    });
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: ProfilePasswordFormData): void {
    if (value) {
      this.oldPasswordCtrl.setValue(value.oldPassword);
      this.newPasswordCtrl.setValue(value.newPassword);
      this.confirmNewPasswordCtrl.setValue(value.confirmNewPassword);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.passwordFormGroup.valid ? null : passwordValidator(this.passwordFormGroup);
  }

  /**
   * This Function is triggered as soon as a change in the strength of the password happens
   *
   * @param strength the new strength as a percentage number. Only 100% denotes a strong password
   */
  onStrengthChanged(strength: number): void {
    this.passwordStrong.emit(strength === 100);
  }

  getInputType(passwordField: string): string {
    if (passwordField === 'oldPassword') {
      if (this.showOldPassword) {
        return 'text';
      }
      return 'password';
    } else {
      if (this.showNewPasswords) {
        return 'text';
      }
      return 'password';
    }
  }

  toggleShowOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleShowNewPasswords(): void {
    this.showNewPasswords = !this.showNewPasswords;
  }
}
