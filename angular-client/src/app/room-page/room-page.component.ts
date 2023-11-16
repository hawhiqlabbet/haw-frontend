import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { GameService } from '../services/game.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit {
  @ViewChild('floatingCircle') floatingCircle!: ElementRef

  username: string = ''
  circleRadius = 21.5
  gameId: string = ''

  constructor(private gameService: GameService, private router: Router, private route: ActivatedRoute) {

    // Initialize listeners for socket events
    this.gameService.disconnectSocketEvent();
    this.gameService.playerJoinedEvent();
    this.gameService.playerLeftEvent();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameId = params['gameId'];
    });
  }

  users = [
    { fill: 'blue', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: '#33FF57', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: 'red', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: 'yellow', cx: this.getRandomX(), cy: this.getRandomY() }
  ];


  closeLobby(): void {
    this.gameService.closeLobby(this.gameId).subscribe({
      next: (response) => {
        console.log(response)
        const { message } = response
        if (message === 'closeLobbySuccess') {
          this.gameService.closeLobbySocket(this.gameId, this.username)
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getRandomX(): string {
    const circleRadius = 21.5;
    return `${Math.random() * (window.innerWidth - 2 * circleRadius) + circleRadius}`;
  }

  getRandomY(): string {
    const circleRadius = 21.5;
    return `${Math.random() * (window.innerHeight - 2 * circleRadius) + circleRadius}`;
  }

  leaveGame(): void {

  }

}
