import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import anime from 'animejs/lib/anime.es'
import { GameService } from '../services/game.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit {
  @ViewChild('floatingCircle') floatingCircle!: ElementRef

  gameId: string = ''
  username: string = ''

  ngOnInit(): void {
    // Get the circle element
    const circle = this.floatingCircle.nativeElement

    // Set initial position
    anime.set(circle, {
      translateX: anime.random(0, window.innerWidth - 50),
      translateY: anime.random(0, window.innerHeight - 50),
    })

    // Animate the circle's movement
    anime({
      targets: circle,
      translateX: () => anime.random(0, window.innerWidth - 50),
      translateY: () => anime.random(0, window.innerHeight - 50),
      easing: 'easeInOutQuad',
      duration: 3000,
      loop: true,
    })
  }

  constructor(private gameService: GameService, private router: Router) {
    this.gameId = this.router.getCurrentNavigation()?.extras?.state?.['gameId']
    this.username = this.router.getCurrentNavigation()?.extras?.state?.['username']

    // Initialize listeners for socket events
    this.gameService.disconnectSocketEvent();
    this.gameService.playerJoinedEvent();
    this.gameService.playerLeftEvent();
  }

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



}
