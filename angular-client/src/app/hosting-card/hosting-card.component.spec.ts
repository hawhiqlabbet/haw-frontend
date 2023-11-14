import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingCardComponent } from './hosting-card.component';

describe('HostingCardComponent', () => {
  let component: HostingCardComponent;
  let fixture: ComponentFixture<HostingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostingCardComponent]
    });
    fixture = TestBed.createComponent(HostingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
