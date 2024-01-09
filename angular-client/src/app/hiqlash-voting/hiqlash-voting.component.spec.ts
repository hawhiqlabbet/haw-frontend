import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiqlashVotingComponent } from './hiqlash-voting.component';

describe('HiqlashVotingComponent', () => {
  let component: HiqlashVotingComponent;
  let fixture: ComponentFixture<HiqlashVotingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HiqlashVotingComponent]
    });
    fixture = TestBed.createComponent(HiqlashVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
