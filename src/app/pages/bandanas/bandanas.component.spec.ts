import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandanasComponent } from './bandanas.component';

describe('BandanasComponent', () => {
  let component: BandanasComponent;
  let fixture: ComponentFixture<BandanasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandanasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
