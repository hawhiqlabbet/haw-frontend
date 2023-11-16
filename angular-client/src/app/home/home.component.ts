import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

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

  constructor(private router: Router, private userService: UserService) {
    //this.username = this.router.getCurrentNavigation()?.extras?.state?.['username']
    //this.imageUrl = this.router.getCurrentNavigation()?.extras?.state?.['imageUrl']
    this.userService.getUsername.subscribe(username => this.username = username)
    this.userService.getImageUrl.subscribe(imageUrl => this.imageUrl = imageUrl)
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
