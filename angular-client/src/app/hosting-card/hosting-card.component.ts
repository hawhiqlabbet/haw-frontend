import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hosting-card',
  templateUrl: './hosting-card.component.html',
  styleUrls: ['./hosting-card.component.scss']
})
export class HostingCardComponent {

  isFlipped: boolean = false;
  gameId: string = '';

  constructor(private router: Router, private gameService: GameService) { }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  hostGame() {
    this.router.navigate(['/games']);

  }

  joinGame(): void {
    this.gameService.joinGame(this.gameId).subscribe({
      next: (response) => {
        console.log(response)
        const { gameId, username, message } = response
        if (message === 'joinGameSuccess') {
          this.gameService.joinGameSocketConnect(gameId, username)
        }

      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
