import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStateTagComponent } from './report-state-tag.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NbCardModule, NbTagModule} from '@nebular/theme';
import {MockModule} from 'ng-mocks';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient} from '@angular/common/http';

describe('ReportStateTagComponent', () => {
  let component: ReportStateTagComponent;
  let fixture: ComponentFixture<ReportStateTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ReportStateTagComponent
      ],
      imports: [
        HttpClientTestingModule,
        NbCardModule,
        MockModule(NbTagModule),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
