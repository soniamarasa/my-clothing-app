import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedLookDialog } from './planned-look-dialog.component';

describe('PlannedLookDialog', () => {
  let component: PlannedLookDialog;
  let fixture: ComponentFixture<PlannedLookDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlannedLookDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannedLookDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
