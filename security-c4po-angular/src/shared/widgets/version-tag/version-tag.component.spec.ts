import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VersionTagComponent} from './version-tag.component';
import {MockModule} from 'ng-mocks';
import {NbTagModule} from '@nebular/theme';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('VersionTagComponent', () => {
  let component: VersionTagComponent;
  let fixture: ComponentFixture<VersionTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VersionTagComponent
      ],
      imports: [
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(VersionTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
