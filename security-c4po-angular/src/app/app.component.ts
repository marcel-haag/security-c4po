import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import localeDe from '@angular/common/locales/de';
import {registerLocale} from 'i18n-iso-countries';
import {registerLocaleData} from '@angular/common';
import {Store} from '@ngxs/store';
import {BehaviorSubject, Subscription} from 'rxjs';
import {SessionState, SessionStateModel} from '../shared/stores/session-state/session-state';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'security-c4po-angular';

  $authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private authStateSubscription: Subscription;

  constructor(private translateService: TranslateService,
              private store: Store,
              @Inject(LOCALE_ID) private localeId: string) {
    this.initApp();
  }

  ngOnInit(): void {
    // authState change handling
    this.authStateSubscription = this.store.select(SessionState).pipe(
      filter(isNotNullOrUndefined),
      untilDestroyed(this)
    ).subscribe({
      next: (state: SessionStateModel) => {
        this.$authState.next(state.isAuthenticated);
      },
      error: (err) => console.error('auth error:', err)
    });
  }

  initApp(): void {
    // for global language
    this.translateService.use(this.localeId);

    // for number, date and time
    registerLocaleData(localeDe, 'de-DE');

    this.setupCountryCode();
  }

  /**
   * i18n-iso-countries
   * TODO: can be also lazy loaded if selected language exist
   */
  setupCountryCode(): void {
    // Support german languages.
    // @ts-ignore
    registerLocale(require('i18n-iso-countries/langs/en.json'));
    // @ts-ignore
    registerLocale(require('i18n-iso-countries/langs/de.json'));
  }

  ngOnDestroy(): void {
    // This method must be present when using ngx-take-until-destroy
    // even when empty
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
      this.authStateSubscription = undefined;
    }
  }
}
