import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCheckboxDialogComponent } from './confirm-checkbox-dialog.component';

describe('ConfirmCheckboxDialogComponent', () => {
  let component: ConfirmCheckboxDialogComponent;
  let fixture: ComponentFixture<ConfirmCheckboxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCheckboxDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCheckboxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
