import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnusedLooksComponent } from './unused-looks.component';

describe('UnusedLooksComponent', () => {
  let component: UnusedLooksComponent;
  let fixture: ComponentFixture<UnusedLooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnusedLooksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusedLooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
