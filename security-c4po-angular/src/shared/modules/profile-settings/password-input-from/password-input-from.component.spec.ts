import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordInputFromComponent} from './password-input-from.component';
import {NbFormFieldModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {KeycloakService} from 'keycloak-angular';

describe('PasswordInputFromComponent', () => {
  let component: PasswordInputFromComponent;
  let fixture: ComponentFixture<PasswordInputFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PasswordInputFromComponent
      ],
      imports: [
        NbFormFieldModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ThemeModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NgxsModule.forRoot([SessionState]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        KeycloakService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordInputFromComponent);
    component = fixture.componentInstance;
    // ToDo: fix detectChanges() when from control accessor is defined
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
