import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) { }


  canActivate(): boolean {
    const username = localStorage.getItem('username');

    if (!username) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;

  }
}
