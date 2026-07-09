import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PagesComponent } from './pages.component';

describe('PagesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PagesComponent],
    }).compileComponents();
  });

  it('should create the shell component', () => {
    const fixture = TestBed.createComponent(PagesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
