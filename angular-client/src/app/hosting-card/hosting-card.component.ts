// hosting-card.component.ts
import { Component } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-hosting-card',
  templateUrl: './hosting-card.component.html',
  styleUrls: ['./hosting-card.component.scss']
})
export class HostingCardComponent {
  
  isFlipped: boolean = false;
  gameId: string = '';

  constructor(private gameService: GameService) {}

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  hostGame(): void {
    this.gameService.hostGame().subscribe({
      next: (response) => {
        
        const { gameId, username, message } = response
        if (message === 'hostGameSuccess') {
          this.gameService.hostGameSocketConnect(gameId, username)
        }

      },
      error: (err) => {
        console.log(err)
      }
    })
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
