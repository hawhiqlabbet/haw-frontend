import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

  code: string = "";

  constructor(private router: Router) {
    this.code = this.router.getCurrentNavigation()?.extras?.state?.['code']
  }

}
