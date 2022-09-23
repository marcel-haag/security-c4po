import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveCategoriesComponent } from './objective-categories.component';
import {NbMenuModule, NbMenuService} from '@nebular/theme';
import {NgxsModule} from '@ngxs/store';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeModule} from '@assets/@theme/theme.module';
import {RouterTestingModule} from '@angular/router/testing';

describe('ObjectiveCategoriesComponent', () => {
  let component: ObjectiveCategoriesComponent;
  let fixture: ComponentFixture<ObjectiveCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ObjectiveCategoriesComponent
      ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        NbMenuModule.forRoot(),
        ThemeModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NgxsModule.forRoot([ProjectState]),
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        NbMenuService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
