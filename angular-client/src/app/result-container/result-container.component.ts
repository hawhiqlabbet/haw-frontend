
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router'
import { Subscription } from 'rxjs';

import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-result-container',
  templateUrl: './result-container.component.html',
  styleUrls: ['./result-container.component.scss']
})
export class ResultContainerComponent implements OnInit {
  @Input() votingData: any[] = []
  @Input() gameData: any
  @Input() subscriptions: Subscription[] = []
  @Input() gameId: string = ''

  username: string = localStorage.getItem('username') ?? ''
  isHost = localStorage.getItem("isHost") == 'true' ? true : false
  showResultText: boolean = false

  constructor(private gameService: GameService, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.fadeOutResultText();
    }, 3000);
  }

  closeLobby(): void {
    this.subscriptions.push(
      this.userService.closeLobby(this.gameId, this.username).subscribe({
        next: (response) => {
          const { message } = response
          if (message === 'closeLobbySuccess') {
            this.gameService.closeLobbySocket(this.gameId, this.username)
            this.router.navigateByUrl('/home')
            localStorage.removeItem('isHost')
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
    )
  }

  newRound(): void {
    this.subscriptions.push(
      this.userService.newRound(this.gameId, this.username).subscribe({
        next: (response) => {
          console.log(response)
          const { message } = response
          if (message === 'newRoundSuccess') {
            this.gameService.newRoundSocket(this.gameId, this.username)
            this.resetRoom()

          }
        },
        error: (err) => {
          console.log(err)
        }
      })
    )
  }

  fadeOutResultText() {
    anime({
      targets: '#spyNotFound',
      opacity: 0,
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        this.showResultText = true;
      }
    });
  }

  resetRoom(): void {

    console.log("RESET ROOM")

    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });

  }
}
