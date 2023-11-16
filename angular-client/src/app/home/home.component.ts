import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  username: string = ''

  constructor(private router: Router) {
    this.username = this.router.getCurrentNavigation()?.extras?.state?.['username']
  }

}
