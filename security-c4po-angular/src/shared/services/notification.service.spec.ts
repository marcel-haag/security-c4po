import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpLoaderFactory} from '../../app/common-app.module';
import {HttpClient} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '../stores/session-state/session-state';
import {KeycloakService} from 'keycloak-angular';
import {NbToastrModule, NbToastrService} from '@nebular/theme';

describe('NotificationService', () => {
  let toastrServiceStub: Partial<NbToastrService>;
  let translateServiceStub: Partial<TranslateService>;
  let service: NotificationService;

  toastrServiceStub = {
    show(): any {
      return {};
    }
  };

  translateServiceStub = {
    get(): Observable<string | any> {
      return of(new Observable<string>());
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NbToastrModule,
        NgxsModule.forRoot([SessionState]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        NotificationService,
        KeycloakService,
        {provide: NbToastrService, useValue: toastrServiceStub},
        {provide: TranslateService, useValue: translateServiceStub}]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
