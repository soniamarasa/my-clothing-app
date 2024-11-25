import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDialog } from './list-dialog.component';

describe('ListDialog', () => {
  let component: ListDialog;
  let fixture: ComponentFixture<ListDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
