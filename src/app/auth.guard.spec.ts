import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let authGuard: AuthGuard
  let router: Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    })

    authGuard = TestBed.inject(AuthGuard)
    router = TestBed.inject(Router)

  })

  it('should allow navigation if username is set', () => {
    spyOn(localStorage, 'getItem').and.returnValue('username')
    spyOn(router, 'navigateByUrl')

    const canActivate = authGuard.canActivate()

    expect(canActivate).toBeTrue()
    expect(localStorage.getItem).toHaveBeenCalledWith('username')
    expect(router.navigateByUrl).not.toHaveBeenCalled()
  })

  it('should redirect to root if username not set', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null)
    spyOn(router, 'navigateByUrl')

    const canActivate = authGuard.canActivate()

    expect(canActivate).toBeFalse()
    expect(localStorage.getItem).toHaveBeenCalledWith('username')
    expect(router.navigateByUrl).not.toHaveBeenCalledWith('/')
  })
});
