import {DateTimeFormatPipe} from './date-time-format.pipe';
import {User} from '@shared/models/user.model';
import {NumberAndDateFormatSystem} from '@shared/models/number-and-date-time-format.model';
import {SESSION_STATE_NAME, SessionState, SessionStateModel} from '@shared/stores/session-state/session-state';
import {NgxsModule, Store} from '@ngxs/store';
import {UserService} from '@shared/services/user.service';
import {inject, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpLoaderFactory} from '../../app/common-app.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {KeycloakService} from 'keycloak-angular';

const DESIRED_STORE_STATE_SESSION: SessionStateModel = {
  userAccount: {
    ...new User('ttt', 'test', 'user', 'default.user@test.de', 'en-US'),
    id: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
  },
  isAuthenticated: true
};

describe('DateTimeFormatPipe', () => {
  let pipe: DateTimeFormatPipe;
  let store: Store;
  // tslint:disable-next-line:prefer-const
  let dateAndNumberFormat: NumberAndDateFormatSystem;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NgxsModule.forRoot([SessionState]),
      ],
      declarations: [
        DateTimeFormatPipe,
      ],
      providers: [
        {provide: UserService},
        {provide: KeycloakService}
      ]
    }).compileComponents();
  });

  beforeEach(inject([Store], (inStore: Store) => {
      store = inStore;
      store.reset({
        ...store.snapshot(),
        [SESSION_STATE_NAME]: DESIRED_STORE_STATE_SESSION
      });
      pipe = new DateTimeFormatPipe(inStore);
    })
  );

  it('should init', () => {
    expect(pipe).toBeTruthy();
  });

  it('return "-" if value is null', () => {
    dateAndNumberFormat = NumberAndDateFormatSystem.ENGLISH;
    const value: string = null;
    expect(pipe.transform(value)).toEqual('-');
  });
// ToDo: Enable tests after angular version upgrade
/*
  it('return english date time format if NumberAndDateFormatSystem is undefined', () => {
    dateAndNumberFormat = undefined;
    const value = '2019-11-24T14:34:16.802Z';
    const oldFormatDate = formatDate;
    const formatSpy = jest.spyOn(require('@angular/common'), 'formatDate')
      .mockReturnValue((val, format, locale, timezone) => {
        expect(val).toBe(value);
        expect(format).toBe(CustomPipe.DATE_TIME_FMT_EN);
        expect(locale).toBe('en-US');
        expect(timezone).toBeUndefined();
        return oldFormatDate(val, format, locale, timezone);
      });
    pipe.transform(value);
    // Does unfortunately not work here: expect(formatSpy).toHaveBeenCalledWith(value, CustomPipe.DATE_FMT_EN, 'en-us');
    expect(formatSpy).toHaveBeenCalledTimes(1);
  });

  it('return english date time format if NumberAndDateFormatSystem is english', () => {
    dateAndNumberFormat = NumberAndDateFormatSystem.ENGLISH;
    const value = '2019-11-24T14:34:16.802Z';
    const oldFormatDate = formatDate;
    const formatSpy = jest.spyOn(require('@angular/common'), 'formatDate')
      .mockReturnValue((val, format, locale, timezone) => {
        expect(val).toBe(value);
        expect(format).toBe(CustomPipe.DATE_TIME_FMT_EN);
        expect(locale).toBe('en-US');
        expect(timezone).toBeUndefined();
        return oldFormatDate(val, format, locale, timezone);
      });
    pipe.transform(value);
    // Does unfortunately not work here: expect(formatSpy).toHaveBeenCalledWith(value, CustomPipe.DATE_FMT_EN, 'en-us');
    expect(formatSpy).toHaveBeenCalledTimes(1);
  });

  it('return german date time format if NumberAndDateFormatSystem is german', () => {
    registerLocaleData(localeDe, 'de-DE');
    dateAndNumberFormat = NumberAndDateFormatSystem.GERMAN;
    const userAccountUpdate = new User('test', 'test', 'test', 'test@test.de', 'de-DE');
    store.dispatch(new UpdateUserSettings(userAccountUpdate));
    const value = '2019-11-24T14:34:16.802Z';
    const oldFormatDate = formatDate;
    const formatSpy = jest.spyOn(require('@angular/common'), 'formatDate')
      .mockReturnValue((val, format, locale, timezone) => {
        expect(val).toBe(value);
        expect(format).toBe(CustomPipe.DATE_TIME_FMT_DE);
        expect(locale).toBe('de-DE');
        expect(timezone).toBeUndefined();
        return oldFormatDate(val, format, locale, timezone);
      });
    expect(pipe.transform(value).endsWith(' Uhr')).toBeTruthy();
    // Does unfortunately not work here: expect(formatSpy).toHaveBeenCalledWith(value, CustomPipe.DATE_FMT_EN, 'en-us');
    expect(formatSpy).toHaveBeenCalledTimes(1);
  });
*/
});
