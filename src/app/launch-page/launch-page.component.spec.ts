import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LaunchPageComponent } from './launch-page.component';
import { Router } from '@angular/router';

describe('LaunchPageComponent', () => {
  let component: LaunchPageComponent
  let fixture: ComponentFixture<LaunchPageComponent>
  let router: Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaunchPageComponent],
      imports: [RouterTestingModule]
    });
    fixture = TestBed.createComponent(LaunchPageComponent)
    component = fixture.componentInstance
    router = TestBed.inject(Router)
    fixture.detectChanges()
  });

  it('should create the launch page component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to /home if username exist in local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('username')

    const routerSpy = spyOn(router, 'navigate')
    component.ngOnInit()
    expect(routerSpy).toHaveBeenCalledWith(['/home'])
  });

  it('should be able to set username and redirect to /home', () => {
    const setUsernameSpy = spyOn(localStorage, 'setItem')
    const routerSpy = spyOn(router, 'navigate')

    component.chooseUsername('testUsername')
    expect(setUsernameSpy).toHaveBeenCalledWith('username', 'testUsername')
    expect(routerSpy).toHaveBeenCalledWith(['/home'])
  });

});
