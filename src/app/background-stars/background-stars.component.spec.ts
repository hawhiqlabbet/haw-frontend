import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundStarsComponent } from './background-stars.component';

describe('BackgroundStarsComponent', () => {
  let component: BackgroundStarsComponent;
  let fixture: ComponentFixture<BackgroundStarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackgroundStarsComponent]
    });
    fixture = TestBed.createComponent(BackgroundStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
