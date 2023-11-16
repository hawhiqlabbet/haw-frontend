// hosting-card.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hosting-card',
  templateUrl: './hosting-card.component.html',
  styleUrls: ['./hosting-card.component.scss']
})
export class HostingCardComponent {
  
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>

  isFlipped: boolean = false;
  gameId: string = '';

  constructor(private gameService: GameService, private router: Router) {}

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  hostGame(): void {
    this.gameService.hostGame().subscribe({
      next: (response) => {
        
        const { gameId, username, message } = response
        if (message === 'hostGameSuccess') {
          this.gameService.hostGameSocketConnect(gameId, username)
          this.router.navigateByUrl('/room', { state: { gameId: gameId, username: username } })
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
          this.router.navigateByUrl('/room', { state: { gameId: gameId, username: username } })
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
