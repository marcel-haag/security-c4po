import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {NbMenuItem, NbMenuService, NbThemeService} from '@nebular/theme';
import {map} from 'rxjs/operators';
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

  currentTheme = '';
  languages = ['en-US', 'de-DE'];
  selectedLanguage = '';

  // User Menu Properties
  userPictureOnly = false;
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  userMenu: NbMenuItem[] = [
    {
      title: '',
      pathMatch: 'prefix'
    }
  ];
  readonly FALLBACK_IMG = 'assets/images/demo/anon-user-icon.png';

  constructor(
    private store: Store,
    private router: Router,
    private themeService: NbThemeService,
    private translateService: TranslateService,
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

    this.selectedLanguage = this.translateService.currentLang;
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
        if (menuBag.item.pathMatch === 'prefix') {
          this.onClickLogOut();
        }
      });
    // Setup stream to translate menu item
    this.translateService.stream('global.action.logout')
      .pipe(
        untilDestroyed(this)
      ).subscribe((text: string) => {
      this.userMenu[0].title = text;
    });
  }

  // HTML only
  onClickGoToLink(url: string): void {
    window.open(url, '_blank');
  }

  onClickSwitchTheme(): void {
    if (this.currentTheme === 'corporate') {
      this.themeService.changeTheme('dark');
    } else if (this.currentTheme === 'dark') {
      this.themeService.changeTheme('corporate');
    }
  }

  onClickLogOut(): void {
    console.info('Logging out...');
    // ToDo: Redirect user to Landing page from Issue #142 https://github.com/Marcel-Haag/security-c4po/issues/143
    // ToDo: Fix Redirect URI in Keycloak Setting
    /*this.keycloakService.logout(`http://auth-server/realms/${environment.keycloakclientId}/protocol/openid-connect/logout`).then(() => {
      // Route user back to default page
      this.router.navigate([Route.HOME]).then(() => {
        // Reset User props from store
        this.store.dispatch(new ResetSession());
      }, err => {
        console.error(err);
      });
    }, err => {
      console.error(err);
    });*/
  }

  onClickLanguage(language: string): void {
    this.translateService.use(language);
  }
}
