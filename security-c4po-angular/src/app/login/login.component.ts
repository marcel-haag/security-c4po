import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {NotificationService, PopupType} from '../../shared/services/notification.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {User} from '../../shared/models/user.model';
import {throwError} from 'rxjs';
import {UpdateIsAuthenticated, UpdateUser} from '../../shared/stores/session-state/session-state.actions';
import {GlobalTitlesVariables} from '../../shared/config/global-variables';
import {HttpClient} from '@angular/common/http';
import {FieldStatus} from '../../shared/models/form-field-status.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  readonly MIN_LENGTH: number = 2;
  readonly SECURITYC4PO_TITLE = GlobalTitlesVariables.SECURITYC4PO_TITLE;
  readonly NOVATEC_NAME = GlobalTitlesVariables.NOVATEC_NAME;

  // ToDo: Remove after adding real authentication
  private readonly user = new User('ttt', 'test', 'user', 'default.user@test.de', 'en-US');

  version: string;

  // form control elements
  loginFormGroup: FormGroup;
  loginUsernameCtrl: AbstractControl;
  loginPasswordCtrl: AbstractControl;

  loginFailedWithCurrentCredentials = false;
  invalidUsername: string;
  invalidPassword: string;

  formCtrlStatus = FieldStatus.BASIC;

  constructor(private fb: FormBuilder,
              private router: Router,
              private store: Store,
              private readonly httpClient: HttpClient,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(this.MIN_LENGTH)]],
      password: ['', Validators.required]
    });

    this.loginUsernameCtrl = this.loginFormGroup.get('username');
    this.loginPasswordCtrl = this.loginFormGroup.get('password');

    this.loginFormGroup.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.formCtrlStatus = FieldStatus.BASIC;
        this.loginFailedWithCurrentCredentials = false;
      });
    this.readAppVersion();
  }

  login(): void {
    const username = this.loginUsernameCtrl.value;
    const password = this.loginPasswordCtrl.value;
    if (username === DefaultUser.username
      && password === DefaultUser.password) {
      // ToDo: Should be handled in Guards
      this.store.dispatch(new UpdateIsAuthenticated(true));
      this.store.dispatch(new UpdateUser(this.user, true));
      this.router.navigate(['/home']).then(() => {
        this.notificationService.showPopup('popup.login.successful', PopupType.SUCCESS);
      }, err => {
        console.error(err);
      });
    } else {
      this.invalidUsername = username;
      this.invalidPassword = password;
      this.loginFailedWithCurrentCredentials = true;
      this.formCtrlStatus = FieldStatus.DANGER;
      throwError('Invalid Credentials');
      console.error('Invalid Credentials');
    }
  }

  onEnterPressed(): void {
    this.login();
  }

  formIsEmptyOrInvalid(): boolean {
    return this.isEmpty(this.loginUsernameCtrl.value)
      || this.isEmpty(this.loginPasswordCtrl.value)
      || this.loginPasswordCtrl.invalid
      || this.loginFailedWithCurrentCredentials === true;
  }

  /**
   * @param ctrlValue of type string
   * @return if ctrlValue is empty or not
   */
  isEmpty(ctrlValue: string): boolean {
    return ctrlValue === '';
  }

  ngOnDestroy(): void {
    // This method must be present when using ngx-take-until-destroy
    // even when empty
  }

  readAppVersion(): void {
    this.httpClient.get<Version>('assets/version.json', {responseType: 'json'})
      .subscribe((data: Version) => {
        this.version = data.version;
      });
  }
}

export interface Version {
  version: string;
}

export enum DefaultUser {
  username = 'ttt',
  password = 'Test1234!'
}


