import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpyqGameComponent } from './spyq-game.component';

describe('SpyqGameComponent', () => {
  let component: SpyqGameComponent;
  let fixture: ComponentFixture<SpyqGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpyqGameComponent]
    });
    fixture = TestBed.createComponent(SpyqGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
