import {ChangeDetectionStrategy, Component, Input, OnInit, Output} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProfilePasswordFormData} from '@shared/modules/profile-settings/password-input-from/util/profile-password-form-data.model';
import {Patterns} from '@shared/modules/profile-settings/patterns';
import {LanguageOptions} from '@shared/modules/export-report-dialog/export-report-dialog.component';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {User} from '@shared/models/user.model';
import {UserService} from '@shared/services/user-service/user.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import deepEqual from 'deep-equal';
import {UpdateUser, UpdateUserSettings} from '@shared/stores/session-state/session-state.actions';
import {mapTo, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
@UntilDestroy()
export class ProfileSettingsComponent implements OnInit {
  /**
   * @param data contains all relevant information the dialog needs
   * @param data.title The translation key for the dialog title
   * @param data.key The translation key for the shown message
   * @param data.data The data that may be used in the message translation key
   */
  @Input() data: any;
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  @Output() userServiceError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // HTML only
  readonly fa = FA;
  readonly USER_IMG = 'assets/images/demo/anon-user-icon.png';

  // User form
  userFormGroup: FormGroup;
  userNameControl: AbstractControl;
  userFirstNameControl: AbstractControl;
  userLastNameControl: AbstractControl;
  userEmailControl: AbstractControl;
  oldUserData: UserProfileFormData;

  // Password form
  passwordFormGroup: FormGroup;
  userPasswordInputControl: AbstractControl;
  private readonly initialPasswordInput: ProfilePasswordFormData = {oldPassword: '', newPassword: '', confirmNewPassword: ''};
  passwordStrong: boolean;
  oldPasswordData: ProfilePasswordFormData;


  // Language change
  profileLanguageControl = new FormControl(LanguageOptions.ENGLISH);
  profileLanguages = LanguageOptions;

  constructor(protected dialogRef: NbDialogRef<any>,
              private fb: FormBuilder,
              private store: Store,
              private userService: UserService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.profileLanguageControl.setValue(this.translateService.currentLang);
    this.setupUserFormGroup();
    // Load user profile
    this.userService.loadUserProfile().pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (user: User) => {
        this.user.next(user);
        this.userNameControl.setValue(user.username);
        this.userFirstNameControl.setValue(user.firstName);
        this.userLastNameControl.setValue(user.lastName);
        console.warn(this.user.getValue());
      },
      error: err => {
        console.error(err);
      }
    });
    this.oldUserData = Object.assign({}, this.userFormGroup.getRawValue());
    // Setup password
    this.setupPasswordFormGroup();
    this.oldPasswordData = Object.assign({}, this.passwordFormGroup.getRawValue());
  }

  setupUserFormGroup(): void {
    this.userFormGroup = this.fb.group({
      username: [{value: '', disabled: true}, [Validators.required, Validators.pattern(Patterns.NO_WHITESPACES)]],
      firstName: [{value: '', disabled: true}, [Validators.required, Validators.pattern(Patterns.NO_WHITESPACES)]],
      lastName: [{value: '', disabled: true}, [Validators.required, Validators.pattern(Patterns.NO_WHITESPACES)]],
      eMail: [{value: '', disabled: true}, [Validators.required, Validators.email, Validators.pattern(Patterns.NO_WHITESPACES)]],
      avatarUploader: null
    });
    // Get form controls
    this.userNameControl = this.userFormGroup.get('username');
    this.userFirstNameControl = this.userFormGroup.get('firstName');
    this.userLastNameControl = this.userFormGroup.get('lastName');
    this.userEmailControl = this.userFormGroup.get('eMail');
  }

  setupPasswordFormGroup(): void {
    this.passwordFormGroup = this.fb.group({
      passwordInput: this.initialPasswordInput
    });
    // get password-form control
    this.userPasswordInputControl = this.passwordFormGroup.get('passwordInput');
  }

  changePasswordInKeycloak(): void {
    this.userService.redirectToChangePasswordAction().then(r => {
      // tslint:disable-next-line:no-console
      console.info('Redirecting to Keycloak for password change...');
    });
  }

  onClickLanguage(language: string): void {
    this.translateService.use(language);
  }

  onClickConfirm(): void {
    // ToDo: use handleUserUpdate() here
    const userFormData: UserProfileFormData = this.userFormGroup.getRawValue();
    // ToDo: use handlePasswordChange() here
    const passwordFormData: ProfilePasswordFormData = this.passwordFormGroup.getRawValue();
    // tslint:disable-next-line:no-console
    console.info('User', userFormData);
    // tslint:disable-next-line:no-console
    console.info('Password', passwordFormData);
    // ToDo: Fix?
    if (this.allowChangeProfileData() && this.allowChangePassword()) {
      const formAndUser: [UserProfileFormData, User] = this.extractFormAndUser();
      this.handleUserUpdate(formAndUser['1']).subscribe({
        complete: () => {
          this.handlePasswordChange();
        }
      });
    }
    // Changes occur only on the profile data without the password
    else if (this.allowChangeProfileData()) {
      const formAndUser: [UserProfileFormData, User] = this.extractFormAndUser();
      this.handleUserUpdate(formAndUser['1']).subscribe({
        complete: () => this.dialogRef.close({confirm: true})
      });
    }
    // Changes occur only on the password
    else if (this.allowChangePassword()) {
      this.handlePasswordChange();
    }
    // this.dialogRef.close({confirm: true});
  }

  private handleUserUpdate(user: User): Observable<void> {
    return this.userService.changeUserProperties(user)
      .pipe(
        tap({
          next: resultingUser => {
            this.store.dispatch(new UpdateUserSettings(resultingUser));
            this.store.dispatch(new UpdateUser(resultingUser, true));
          },
          error: error => {
            console.error(error);
          }
        }),
        mapTo(void 0),
        untilDestroyed(this)
      );
  }

  private handlePasswordChange(): void {
    const formData = this.passwordFormGroup.getRawValue();
    if (formData && formData.passwordInput) {
      const oldPassword = formData.passwordInput.oldPassword;
      const newPassword = formData.passwordInput.newPassword;
      // ToDo: Fix connection to keycloak
      /*this.userService.getCurrentAuthenticatedUser().pipe(
        switchMap((currentUser: CognitoUser) => {
          return this.userService.changePassword(currentUser, oldPassword, newPassword).pipe(
            catchError((err) => {
              if (err && 'message' in err) {
                if (err.code === 'LimitExceededException') {
                  this.notificationService.showPopup('userProfile.password.limitExceeded', PopupType.FAILURE);
                } else {
                  this.notificationService.showPopup('userProfile.password.invalidPassword', PopupType.FAILURE);
                }
              }
              this.userServiceError.next(true);
              return throwError(err);
            }),
            tap(() => {
              this.notificationService.showPopup('userProfile.password.changePasswordSuccess', PopupType.SUCCESS);
              this.userDialogRef.close('confirm');
            })
          );
        }),
      ).subscribe({
        error: err => console.error(err)
      });*/
    }
  }

  onClickCancel(): void {
    console.log(this.userFormGroup.get('firstName').dirty);
    console.log(this.userFormGroup.get('firstName')?.hasError('required'));
    console.log(this.userFirstNameControl.hasError('required'));

    this.dialogRef.close();
  }

  extractFormAndUser(): [UserProfileFormData, User] {
    const user: User = Object.assign(new User(), this.store.selectSnapshot(SessionState.userAccount));
    const formData: UserProfileFormData = this.userFormGroup.getRawValue();
    user.username = formData.username;
    user.firstName = formData.firstName;
    user.lastName = formData.lastName;
    user.mailAddress = formData.email;

    return [formData, user];
  }

  /**
   * Checks for valid changes on both the change-profile-data and the change-password forms.
   * @return true if we have one of the followings:
   *              1. Valid changes on both forms
   *              2. Valid changes on change-password form
   *              3. Valid changes on change-profile-data form with empty old, new and confirm passwords
   */
  allowConfirm(): boolean {
    const userFormValid = this.allowChangeProfileData();

    const passwordFormData: ProfilePasswordFormData = this.passwordFormGroup.getRawValue().passwordInput;
    const passwordFormValid = this.allowChangePassword();
    const passwordFormEmpty = (deepEqual(passwordFormData.oldPassword, '')
      && deepEqual(passwordFormData.newPassword, '')
      && deepEqual(passwordFormData.confirmNewPassword, ''));

    return (userFormValid && passwordFormValid) || (passwordFormValid) || (userFormValid && passwordFormEmpty);
  }

  /**
   * @return true if the change-profile-data form is valid and there are actual changes.
   */
  allowChangeProfileData(): boolean {
    const formData: UserProfileFormData = this.userFormGroup.getRawValue();
    return this.userFormGroup.dirty && this.userFormGroup.valid && !deepEqual(formData, this.oldUserData);
  }

  /**
   * @return true if the change-password form is valid and the password is strong.
   */
  allowChangePassword(): boolean {
    return this.passwordStrong && this.passwordFormGroup.valid && this.userFormGroup.dirty;
  }
}

export interface UserProfileFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUploader: FileList;
}
