import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectComponent} from './project.component';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NbCardModule, NbLayoutModule} from '@nebular/theme';
import {KeycloakService} from 'keycloak-angular';
import {ObjectiveOverviewModule} from '../../objective-overview';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectComponent
      ],
      imports: [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        ObjectiveOverviewModule,
        ThemeModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
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
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
