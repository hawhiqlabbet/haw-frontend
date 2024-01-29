import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HostingCardComponent } from './hosting-card.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';

describe('HostingCardComponent', () => {
  let component: HostingCardComponent;
  let fixture: ComponentFixture<HostingCardComponent>;
  let userServiceStub: Partial<UserService>;

  beforeEach(async () => {
    userServiceStub = {
      joinGame: jasmine.createSpy('joinGame').and.returnValue(of({ gameId: 'gameId', message: 'joinGameSucess' }))
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HostingCardComponent],
      providers: [{ provide: UserService, useValue: userServiceStub }]
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
