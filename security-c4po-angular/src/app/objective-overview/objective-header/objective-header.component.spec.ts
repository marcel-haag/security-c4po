import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectiveHeaderComponent} from './objective-header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../common-app.module';
import {HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule} from '@ngxs/store';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NbActionsModule, NbIconModule} from '@nebular/theme';

describe('ObjectiveHeaderComponent', () => {
  let component: ObjectiveHeaderComponent;
  let fixture: ComponentFixture<ObjectiveHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectiveHeaderComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ThemeModule.forRoot(),
        FontAwesomeModule,
        NbIconModule,
        NbActionsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([ProjectState])
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
