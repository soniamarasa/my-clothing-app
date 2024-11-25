import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListIndicatorComponent } from './list-indicator.component';

describe('ListIndicatorComponent', () => {
  let component: ListIndicatorComponent;
  let fixture: ComponentFixture<ListIndicatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListIndicatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
