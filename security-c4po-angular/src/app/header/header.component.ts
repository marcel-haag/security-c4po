import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {NbMenuItem, NbMenuService, NbThemeService} from '@nebular/theme';
import {filter, map} from 'rxjs/operators';
import {GlobalTitlesVariables} from '@shared/config/global-variables';
import {TranslateService} from '@ngx-translate/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {KeycloakService} from 'keycloak-angular';
import {Store} from '@ngxs/store';
import {ResetSession} from '@shared/stores/session-state/session-state.actions';
import {UserService} from '@shared/services/user-service/user.service';
import {User} from '@shared/models/user.model';
import {BehaviorSubject} from 'rxjs';
import {Route} from '@shared/models/route.enum';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProfileSettingsComponent} from '@shared/modules/profile-settings/profile-settings.component';
import {TutorialDialogComponent} from '@shared/modules/tutorial-dialog/tutorial-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@UntilDestroy()
export class HeaderComponent implements OnInit {

  // HTML only
  readonly fa = FA;
  readonly SECURITYC4PO_TITLE: string = GlobalTitlesVariables.SECURITYC4PO_TITLE;
  // Menu only
  readonly settingsIcon = 'gear';
  readonly logoutIcon = 'right-from-bracket';

  currentTheme = '';

  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  userMenu: NbMenuItem[] = [
    {
      title: 'settings',
      icon: { icon: this.settingsIcon, pack: 'fas' }
    },
    {
      title: 'logout',
      icon: { icon: this.logoutIcon, pack: 'fas'}
    }
  ];
  readonly FALLBACK_IMG = 'assets/images/demo/anon-user-icon.png';

  constructor(
    private store: Store,
    private router: Router,
    private themeService: NbThemeService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private menuService: NbMenuService,
    private userService: UserService,
    protected keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    // Handle theme selection
    this.themeService.onThemeChange()
      .pipe(
        map(({name}) => name),
        untilDestroyed(this),
      ).subscribe(themeName => this.currentTheme = themeName);

    // Load user profile
    this.userService.loadUserProfile().pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (user: User) => {
        this.user.next(user);
      },
      error: err => {
        console.error(err);
      }
    });
    // Handle user profile menu selection
    this.menuService.onItemClick()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((menuBag) => {
        // Makes sure that other menus without icon won't trigger
        if (menuBag.item.icon) {
          // tslint:disable-next-line:no-string-literal
          if (menuBag.item.icon['icon'] === this.settingsIcon) {
            this.dialogService.openCustomDialog(
              ProfileSettingsComponent,
              {
                user: this.user.getValue(),
              }
            ).onClose.pipe(
              filter((confirm) => !!confirm),
              untilDestroyed(this)
            ).subscribe({
              next: () => {
                console.info('New Settings confirmed');
              }
            });
          }
          // tslint:disable-next-line:no-string-literal
          else if (menuBag.item.icon['icon'] === this.logoutIcon) {
            this.onClickLogOut();
          }
        }
      });
    // Setup stream to translate menu item
    this.translateService.stream('global.action.profile')
      .pipe(
        untilDestroyed(this)
      ).subscribe((text: string) => {
      this.userMenu[0].title = text;
    });
    // Setup stream to translate menu item
    this.translateService.stream('global.action.logout')
      .pipe(
        untilDestroyed(this)
      ).subscribe((text: string) => {
      this.userMenu[1].title = text;
    });
  }

  // HTML only
  onClickGoToLink(url: string): void {
    window.open(url, '_blank');
  }

  onClickShowTutorial(): void {
    console.info('To be implemented..');

    this.dialogService.openCustomDialog(
      TutorialDialogComponent,
      {}
    ).onClose.pipe(
      filter((confirm) => !!confirm),
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        console.info('New Settings confirmed');
      }
    });
  }

  onClickSwitchTheme(): void {
    if (this.currentTheme === 'corporate') {
      this.themeService.changeTheme('dark');
    } else if (this.currentTheme === 'dark') {
      this.themeService.changeTheme('corporate');
    }
  }

  onClickLogOut(): void {
    // ToDo: Has to be implemented once HTTPS works

    /*this.userService.logout().then(() => {
      console.warn('logout success');
      // Route user back to default page
      this.router.navigate([Route.HOME]).then(() => {
        // Reset User props from store
        this.keycloakService.clearToken();
        this.store.dispatch(new ResetSession());
      }, err => {
        console.error(err);
      });
    }, err => {
      console.error(err);
    });*/
  }
}
