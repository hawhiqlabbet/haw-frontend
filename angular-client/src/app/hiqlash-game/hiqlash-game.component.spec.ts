import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiqlashGameComponent } from './hiqlash-game.component';

describe('HiqlashGameComponent', () => {
  let component: HiqlashGameComponent;
  let fixture: ComponentFixture<HiqlashGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HiqlashGameComponent]
    });
    fixture = TestBed.createComponent(HiqlashGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
