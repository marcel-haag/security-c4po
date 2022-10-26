import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatusTagComponent} from './status-tag.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient} from '@angular/common/http';
import {NbCardModule, NbTagModule} from '@nebular/theme';
import {MockModule} from 'ng-mocks';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('StatusTagComponent', () => {
  let component: StatusTagComponent;
  let fixture: ComponentFixture<StatusTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StatusTagComponent
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
    fixture = TestBed.createComponent(StatusTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
