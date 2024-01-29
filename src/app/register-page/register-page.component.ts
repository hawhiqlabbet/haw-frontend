import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {

  passwordsNotEqual = false;
  userAlreadyExists = false;
  internalServerError = false;

  constructor(private router: Router, private authService: AuthService) { }

  onSubmit(form: any): void {
    const { username, password, repeatPassword } = form.value;

    if (password != repeatPassword) {
      this.passwordsNotEqual = true;
      setTimeout(() => {
        this.passwordsNotEqual = false;
      }, 3000);
      return;
    }

    this.passwordsNotEqual = false;

    this.authService.register(username, password).subscribe({
      next: (data) => {
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.log('Register failed:', error);

        if (error.status === 400) {
          this.userAlreadyExists = true;
          setTimeout(() => {
            this.userAlreadyExists = false;
          }, 3000);

        } else {
          this.internalServerError = true;
          setTimeout(() => {
            this.internalServerError = false;
          }, 3000);
        }

      }
    });
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

}
