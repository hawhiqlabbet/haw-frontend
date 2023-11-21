import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPageComponent } from './room-page.component';

describe('RoomPageComponent', () => {
  let component: RoomPageComponent;
  let fixture: ComponentFixture<RoomPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomPageComponent]
    });
    fixture = TestBed.createComponent(RoomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should generate random X within the specified range', () => {
    const x = +component.getRandomX();
    expect(x).toBeGreaterThanOrEqual(43);
    expect(x).toBeLessThanOrEqual(window.innerWidth - 43);
  });

  it('should generate random Y within the specified range', () => {
    const y = +component.getRandomY();
    expect(y).toBeGreaterThanOrEqual(43);
    expect(y).toBeLessThanOrEqual((window.innerHeight * 0.7) - 43);
  });

  it('should adjust value coordinate correctly', () => {
    const adjustedValue = component.getAdjustedDiameter('100');
    expect(adjustedValue).toBe('79');
  });

});
