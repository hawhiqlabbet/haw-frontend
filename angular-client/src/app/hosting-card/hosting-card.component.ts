// hosting-card.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-hosting-card',
  templateUrl: './hosting-card.component.html',
  styleUrls: ['./hosting-card.component.scss']
})
export class HostingCardComponent {

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>

  isFlipped: boolean = false;
  gameId: string = '';
  imageUrl: string = ''

  constructor(private router: Router, private userService: UserService) {
    this.userService.getImageUrl.subscribe(imageUrl => this.imageUrl = imageUrl)
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  hostGame() {
    this.router.navigate(['/games']);
  }

  joinGame(): void {
    this.userService.joinGame(this.gameId).subscribe({
      next: (response) => {
        console.log(response)
        const { gameId, username, message } = response
        if (message === 'joinGameSuccess') {
          this.userService.setJoining(true)
          this.router.navigate(['/room', gameId])
        }
      },
      error: (error) => {
        console.log(error)

        if (error.status === 400) {
          this.valueChange.emit('gameIdRequired')
        }

        if (error.status === 404) {
          this.valueChange.emit('lobbyNotFound')
        }

      }
    })
  }

}
