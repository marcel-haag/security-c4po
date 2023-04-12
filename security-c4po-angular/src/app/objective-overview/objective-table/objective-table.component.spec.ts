import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectiveTableComponent} from './objective-table.component';
import {NbCardModule, NbTreeGridModule} from '@nebular/theme';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../common-app.module';
import {HttpClient} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeModule} from '@assets/@theme/theme.module';
import {RouterTestingModule} from '@angular/router/testing';
import {StatusTagComponent} from '@shared/widgets/status-tag/status-tag.component';
import {FindigWidgetComponent} from '@shared/widgets/findig-widget/findig-widget.component';
import {MockComponent} from 'ng-mocks';
import {NgxsModule} from '@ngxs/store';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {DialogServiceMock} from '@shared/services/dialog-service/dialog.service.mock';
import {NotificationService} from '@shared/services/toaster-service/notification.service';
import {NotificationServiceMock} from '@shared/services/toaster-service/notification.service.mock';

describe('ObjectiveTableComponent', () => {
  let component: ObjectiveTableComponent;
  let fixture: ComponentFixture<ObjectiveTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ObjectiveTableComponent,
        MockComponent(StatusTagComponent),
        MockComponent(FindigWidgetComponent)
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        NbCardModule,
        NbTreeGridModule,
        ThemeModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([ProjectState])
      ],
      providers: [
        {provide: DialogService, useClass: DialogServiceMock},
        {provide: NotificationService, useClass: NotificationServiceMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
