import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookDialog } from './look-dialog.component';

describe('LookDialog', () => {
  let component: LookDialog;
  let fixture: ComponentFixture<LookDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LookDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LookDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
