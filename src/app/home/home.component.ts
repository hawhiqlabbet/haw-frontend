import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  username: string = this.userService.getUsername() ?? ''
  imageUrl: string = this.userService.getImageUrl() ?? ''
  lobbyNotFound: boolean = false
  gameIdRequired: boolean = false

  constructor(private router: Router, private userService: UserService) {
  }

  handleNewUsername() {
    this.username = this.userService.getUsername() ?? ''
  }

  handleNewImageUrl() {
    this.imageUrl = this.userService.getImageUrl() ?? ''
  }

  handleValueChange(value: string) {

    if (value === 'lobbyNotFound') {
      this.lobbyNotFound = true
      setTimeout(() => { this.lobbyNotFound = false }, 3000)
    }

    if (value === 'gameIdRequired') {
      this.gameIdRequired = true
      setTimeout(() => { this.gameIdRequired = false }, 3000)
    }
  }

  joinGame(gameId: string): void {
    this.userService.joinGame(gameId, this.username, this.imageUrl).subscribe({
      next: (response) => {
        const { gameId, message } = response;
        if (message === 'joinGameSuccess') {
          this.userService.setIsHost(false)
          this.router.navigate(['/room', gameId])
        }
      },
      error: (error) => {
        if (error.status === 400) {
          this.handleValueChange('gameIdRequired')
        }
        if (error.status === 404) {
          this.handleValueChange('lobbyNotFound')
        }
      }
    });
  }

}
