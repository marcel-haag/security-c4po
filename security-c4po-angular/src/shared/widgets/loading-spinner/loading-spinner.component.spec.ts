import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingSpinnerComponent} from './loading-spinner.component';
import {NbSpinnerModule} from '@nebular/theme';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoadingSpinnerComponent
      ],
      imports: [
        NbSpinnerModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
