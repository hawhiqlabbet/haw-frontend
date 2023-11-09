import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  setTokenInCookie(token: string): void {
    // Set the JWT token in a cookie
    this.cookieService.set('jwtToken', token);
  }

  getTokenFromCookie(): string {
    // Get the JWT token from the cookie
    return this.cookieService.get('jwtToken');
  }

  removeTokenFromCookie(): void {
    // Remove the JWT token from the cookie
    this.cookieService.delete('jwtToken');
  }
}
