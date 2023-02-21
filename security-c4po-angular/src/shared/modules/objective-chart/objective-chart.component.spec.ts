import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectiveChartComponent} from './objective-chart.component';
import {CommonModule} from '@angular/common';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbInputModule, NbLayoutModule, NbTagModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeModule} from '@assets/@theme/theme.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ObjectiveChartComponent', () => {
  let component: ObjectiveChartComponent;
  let fixture: ComponentFixture<ObjectiveChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ObjectiveChartComponent
      ],
      imports: [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        FlexLayoutModule,
        NbInputModule,
        NbTagModule,
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
        NgxsModule.forRoot([ProjectState]),
        HttpClientModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
