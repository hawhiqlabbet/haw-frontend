import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core'
import { GameService } from '../services/game.service'
import { Router } from '@angular/router'
import { UserService } from '../services/user.service'

interface User {
  username: string;
  imageUrl: string;
  cx: string;
  cy: string;
  fill: string;
}

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent {
  @ViewChild('floatingCircle') floatingCircle!: ElementRef

  users: User[] = [];

  username: string = ''
  circleRadius = 21.5
  gameId: string = ''
  gameChoice: string = ''


  constructor(private gameService: GameService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => this.gameId = params['gameId'])
    //this.userService.getUsername.subscribe(username => this.username = username)


    this.gameService.lobbyClosedEvent();
    this.gameService.playerJoinedEvent().subscribe((data: any) => {
      const newUser: User = {
        username: data.username,
        imageUrl: data.imageUrl,
        cx: this.getRandomX(),
        cy: this.getRandomY(),
        fill: 'green',
      };
      this.users.push(newUser);
      console.log(this.users);
    });
    this.gameService.playerJoinedEvent();
    this.gameService.playerLeftEvent();
    this.gameService.hostStartedEvent();

    // Attach the beforeunload event listener to handle disconnection on window close/refresh
    window.addEventListener('beforeunload', () => {
      this.gameService.disconnectBeforeUnload(this.username);
    });
  }

  ngOnInit(): void {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      // If no stored username, subscribe to changes
      this.userService.getUsername.subscribe(username => {
        this.username = username;
        // Store username in local storage
        localStorage.setItem('username', username);
      });
    }
  }

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
    this.gameService.startGameSocket(this.gameId, this.username)
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
