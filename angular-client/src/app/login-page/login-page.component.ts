import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  loginFailed = false;
  emptyFields = false;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  onSubmit(form: any): void {
    const { username, password } = form.value;

    if (!username || !password) {
      this.emptyFields = true;
      this.loginFailed = false;
      setTimeout(() => {
        this.loginFailed = false;
      }, 3000);
      return;
    }

    this.emptyFields = false;

    this.authService.login(username, password).subscribe({
      next: (data) => {
        const { username, imageUrl } = data
        this.userService.setUsername(username)
        this.userService.setImageUrl(imageUrl)
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.log('Login failed:', error);
        this.loginFailed = true;
        setTimeout(() => {
          this.loginFailed = false;
        }, 3000); // 3000 milliseconds = 3 seconds
      }
    });
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }

}









