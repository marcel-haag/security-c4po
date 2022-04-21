import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FindigWidgetComponent} from './findig-widget.component';
import {FontAwesomeTestingModule} from '@fortawesome/angular-fontawesome/testing';

describe('FindigWidgetComponent', () => {
  let component: FindigWidgetComponent;
  let fixture: ComponentFixture<FindigWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FindigWidgetComponent
      ],
      imports: [
        FontAwesomeTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindigWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
