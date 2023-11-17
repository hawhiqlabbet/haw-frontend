import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core'
import { GameService } from '../services/game.service'
import { Router } from '@angular/router'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent {
  @ViewChild('floatingCircle') floatingCircle!: ElementRef

  username: string = ''
  circleRadius = 21.5
  gameId: string = ''

  constructor(private gameService: GameService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => this.gameId = params['gameId'])
    this.userService.getUsername.subscribe(username => this.username = username)


    // Initialize listeners for socket events
    this.gameService.lobbyClosedEvent();
    this.gameService.playerJoinedEvent();
    this.gameService.playerLeftEvent();
  }

  users = [
    { fill: 'blue', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: '#33FF57', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: 'red', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: 'yellow', cx: this.getRandomX(), cy: this.getRandomY() }
  ];

  // BARA HOST SKA KUNNA KÖRA DENNA
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

  leaveGame(): void {
    this.gameService.leaveGame(this.gameId).subscribe({
      next: (response) => {
        console.log(response)
        const { message } = response
        if (message === 'leaveGameSuccess') {
          this.gameService.leaveGameSocket(this.gameId, this.username)
          this.router.navigateByUrl('/home')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  startGame(): void {
    console.log('Starting game...')
  }

  getRandomX(): string {
    const circleRadius = 21.5;
    return `${Math.random() * (window.innerWidth - 2 * circleRadius) + circleRadius}`;
  }

  getRandomY(): string {
    const circleRadius = 21.5;
    return `${Math.random() * (window.innerHeight - 2 * circleRadius) + circleRadius}`;
  }
}
