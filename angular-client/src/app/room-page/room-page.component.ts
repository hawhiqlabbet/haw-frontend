import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core'
import { GameService } from '../services/game.service'
import { Router } from '@angular/router'
import { UserService } from '../services/user.service'
import { environment } from 'src/environments/environment'
import { io } from 'socket.io-client'

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

  users: User[] = [];
  username: string = ''
  circleRadius = 21.5
  gameId: string = ''
  gameChoice: string = ''
  joining: boolean = false

  private socket: any  


  constructor(private gameService: GameService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => this.gameId = params['gameId'])
    this.userService.getUsername.subscribe(username => this.username = username)
    this.userService.getJoining.subscribe(joining => this.joining = joining)

    if(this.joining)
      this.gameService.joinGameSocketConnect(this.gameId, this.username, `https://api.multiavatar.com/${this.username}.png`)

    this.gameService.lobbyClosedEvent()
    this.gameService.playerJoinedEvent().subscribe((data: any) => {
      this.getGameData(this.gameId);
      console.log('player joined new users list: ', this.users);
    });
    this.gameService.playerJoinedEvent();
    this.gameService.playerLeftEvent().subscribe((data: any) => {
      this.users.filter((user) => user.username !== data.username);
      this.getGameData(this.gameId);
      console.log('player left new users list: ', this.users);
    });
    this.gameService.hostStartedEvent();

    // Attach the beforeunload event listener to handle disconnection on window close/refresh
    window.addEventListener('beforeunload', () => {
      this.gameService.disconnectBeforeUnload(this.username);
    });
  }

  // Used to request and store necessary data persistently
  ngOnInit(): void {
    // Retrieve data from local storage
    const storedUsername = localStorage.getItem('username');
    const storedGameId   = localStorage.getItem('gameId');

    // Check username
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

    // Check gameId
    if(storedGameId) {
      this.gameId = storedGameId;
    }
    this.activatedRoute.params.subscribe(params => {
      this.gameId = params['gameId'];
      localStorage.setItem('gameId', this.gameId)
    })

    // On init, refresh the perception of players in the lobby
    this.getGameData(this.gameId);

    //this.socket = io(environment.apiUrl) 
    //this.socket.connect()

    // Reconnect
    const selectedGameId = this.gameId
    this.socket.emit('reconnect', { selectedGameId })
  }

  // BARA HOST SKA KUNNA KÖRA DENNA
  closeLobby(): void {
    this.gameService.closeLobby(this.gameId).subscribe({
      next: (response) => {
        console.log(response)
        const { message } = response
        if (message === 'closeLobbySuccess') {
          this.gameService.closeLobbySocket(this.gameId, this.username)
          this.router.navigateByUrl('/home')
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

getGameData(gameId: string): void {
  this.gameService.getGameData(gameId).subscribe({
    next: (response) => {
      console.log(response)
      const { message } = response
      if (message === 'getGameDataSuccess') {
        const usernames: string[] = response.data.players;

        // Use the usernames to create User objects
        const gameUsers: User[] = usernames.map((username) => ({
          username: username,
          imageUrl: `https://api.multiavatar.com/${username}.png`, // Add default or empty values as needed
          cx: this.getRandomX(),
          cy: this.getRandomY(),
          fill: 'green',
        })).filter((newUser) => !this.users.some((existingUser) => existingUser.username === newUser.username));;

        this.users.push(...gameUsers);
        console.log('Got game data from server')
        console.log(this.users)
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
    const minX = 2 * this.circleRadius;
    const maxX = window.innerWidth - minX;
    return `${Math.random() * (maxX - minX) + minX}`;
  }

  getRandomY(): string {
    const minY = 2 * this.circleRadius;
    const maxY = (window.innerHeight * 0.7) - minY;
    return `${Math.random() * (maxY - minY) + minY}`;
  }

  getAdjustedDiameter(value: any): string {
    return `${Number(value) - this.circleRadius}`;
  }

}
