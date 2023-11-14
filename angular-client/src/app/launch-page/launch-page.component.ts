import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss']
})
export class LaunchPageComponent {

  constructor(private router: Router) { }

  onClick(route: string): void {
    this.router.navigate([route]);
  }

}
