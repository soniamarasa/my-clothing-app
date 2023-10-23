import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedLooksComponent } from './planned-looks.component';

describe('PlannedLooksComponent', () => {
  let component: PlannedLooksComponent;
  let fixture: ComponentFixture<PlannedLooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannedLooksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedLooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
