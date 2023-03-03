import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TimerComponent} from './timer.component';
import {MockPipe} from 'ng-mocks';
import {TimerDurationPipe} from '@shared/pipes/timer-duration.pipe';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CommonModule} from '@angular/common';
import {NotificationService} from '@shared/services/toaster-service/notification.service';
import {NotificationServiceMock} from '@shared/services/toaster-service/notification.service.mock';
import {NgxsModule} from '@ngxs/store';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TimerComponent,
        MockPipe(TimerDurationPipe)
      ],
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NgxsModule.forRoot([]),
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: NotificationService, useValue: new NotificationServiceMock()}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
