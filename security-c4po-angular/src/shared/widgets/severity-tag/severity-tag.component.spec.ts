import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SeverityTagComponent} from './severity-tag.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NbCardModule, NbTagModule} from '@nebular/theme';
import {MockModule} from 'ng-mocks';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient} from '@angular/common/http';

describe('SeverityTagComponent', () => {
  let component: SeverityTagComponent;
  let fixture: ComponentFixture<SeverityTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SeverityTagComponent
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
    fixture = TestBed.createComponent(SeverityTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
