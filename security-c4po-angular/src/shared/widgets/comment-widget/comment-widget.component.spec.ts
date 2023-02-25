import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CommentWidgetComponent} from './comment-widget.component';
import {FontAwesomeTestingModule} from '@fortawesome/angular-fontawesome/testing';

describe('CommentWidgetComponent', () => {
  let component: CommentWidgetComponent;
  let fixture: ComponentFixture<CommentWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CommentWidgetComponent
      ],
      imports: [
        FontAwesomeTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
