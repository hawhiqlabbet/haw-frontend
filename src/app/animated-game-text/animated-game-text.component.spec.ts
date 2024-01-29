import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedGameTextComponent } from './animated-game-text.component';

describe('AnimatedGameTextComponent', () => {
  let component: AnimatedGameTextComponent;
  let fixture: ComponentFixture<AnimatedGameTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimatedGameTextComponent]
    });
    fixture = TestBed.createComponent(AnimatedGameTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
