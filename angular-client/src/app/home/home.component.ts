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
  imageUrl: string = ''
  lobbyNotFound: boolean = false
  gameIdRequired: boolean = false

  constructor(private router: Router) {
    this.username = this.router.getCurrentNavigation()?.extras?.state?.['username']
    this.imageUrl = this.router.getCurrentNavigation()?.extras?.state?.['imageUrl']
  }

  handleValueChange(value: string) {

    console.log(value)

    if (value === 'lobbyNotFound') {
      this.lobbyNotFound = true
      setTimeout(() => {
        this.lobbyNotFound = false
      }, 3000)
    }
    if (value === 'gameIdRequired') {
      this.gameIdRequired = true
      setTimeout(() => {
        this.gameIdRequired = false
      }, 3000)
    }
  }

}
