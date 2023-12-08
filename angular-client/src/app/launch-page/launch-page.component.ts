import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss']
})
export class LaunchPageComponent implements OnInit {

  iconClass: string = 'icon-up bi bi-joystick secondary-icon'

  constructor(private router: Router) {
    this.animateIcon();
  }

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.router.navigate(['/home']);
    }
  }

  chooseUsername(username: string) {
    localStorage.setItem('username', username)
    this.router.navigate(['/home']);
  }

  onClick(route: string): void {
    this.router.navigate([route]);
  }

  animateIcon(): void {
    setInterval(() => {
      const iconObject = document.getElementById('animated-icon')
      iconObject?.removeAttribute(this.iconClass)
      switch (this.iconClass) {
        case 'icon-up bi bi-joystick secondary-icon':
          iconObject?.setAttribute('class', 'icon-left bi bi-joystick secondary-icon');
          this.iconClass = 'icon-left bi bi-joystick secondary-icon'
          break;
        case 'icon-left bi bi-joystick secondary-icon':
          iconObject?.setAttribute('class', 'icon-right bi bi-joystick secondary-icon');
          this.iconClass = 'icon-right bi bi-joystick secondary-icon'
          break;
        case 'icon-right bi bi-joystick secondary-icon':
          iconObject?.setAttribute('class', 'icon-up bi bi-joystick secondary-icon');
          this.iconClass = 'icon-up bi bi-joystick secondary-icon'
          break;
        default:
          break;
      }
    }, 1500)
  }

}
