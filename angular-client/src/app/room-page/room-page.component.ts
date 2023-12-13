import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core'
import { GameService } from '../services/game.service'
import { Router } from '@angular/router'
import { UserService } from '../services/user.service'
import { Subscription } from 'rxjs';

export interface User {
  username: string;
  imageUrl: string;
  cx: number;
  cy: number;
  fill: string;
  isHost: boolean;
}

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent {

  subscriptions: Subscription[] = []

  users: User[] = [];
  username = this.userService.getUsername() ?? ''
  imageUrl = this.userService.getImageUrl() ?? ''
  isHost = this.userService.getIsHost()
  circleRadius = 21.5
  gameId: string = ''
  gameChoice: string = ''
  gameStarted = false
  gameData = ''
  gameTimeInS = undefined
  endTime: Date = new Date()
  endVoteTime: Date = new Date()
  timeDifference: number = 0
  timeDifferenceVote: number = 0
  animationDone = false

  votingDone: boolean = false
  votingData: any = []
  foundSpy: boolean = false
  spyName: string = ""

  constructor(private gameService: GameService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {
        this.gameId = params['gameId']
      })
    )

    if (this.isHost)
      this.gameService.hostGameSocketConnect(this.gameId, this.username, this.gameChoice)
    else
      this.gameService.joinGameSocketConnect(this.gameId, this.username, this.imageUrl)

    this.gameService.lobbyClosedEvent()

    this.subscriptions.push(
      this.gameService.playerJoinedEvent().subscribe((data: any) => {
        this.getGameData(this.gameId);
        setTimeout(() => {
          if (this.username !== data.username)
            console.log('player joined new users list: ', this.users)
        }, 2500)
      })
    )

    this.subscriptions.push(
      this.gameService.playerLeftEvent().subscribe((data: any) => {
        this.getGameData(this.gameId);
        setTimeout(() => {
          console.log('player left new users list: ', this.users)
        }, 2500)
      })
    )

    this.subscriptions.push(
      this.gameService.timerUpdateEvent().subscribe((data: any) => {
        const { endTime, endVoteTime } = data
        this.timeDifference = endTime
        this.timeDifferenceVote = endVoteTime

        if (this.timeDifferenceVote < 0) {
          this.votingDone = true
        }
      })
    )

    this.subscriptions.push(
      this.gameService.hostStartedEvent().subscribe((data: any) => {
        const { username, gameChoice, gameData } = data;
        console.log(`Host ${username} started the game with mode ${gameChoice}`);
        console.log(data);
        this.gameStarted = true;
        this.gameData = gameData.country === "" ? 'spy' : gameData.country;
        //this.endTime = new Date(gameData.endTime)
        //this.endVoteTime = new Date(gameData.endVoteTime)
      })
    )

    // Attach the beforeunload event listener to handle disconnection on window close/refresh
    window.addEventListener('beforeunload', () => {
      this.gameService.disconnectBeforeUnload(this.username);
    });
  }

  handleVotingDoneChanged(value: boolean) {
    this.votingDone = value
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => {
      sub.unsubscribe()
      sub.remove
      this.gameService.disconnectSocket()
      console.log(`Subscription successfully removed.`);
    })
  }

  // Used to request and store necessary data persistently
  ngOnInit(): void {
    this.username = this.userService.getUsername() ?? ''
    this.imageUrl = this.userService.getImageUrl() ?? ''
    this.isHost = this.userService.getIsHost()
    // On init, refresh the perception of players in the lobby
    this.getGameData(this.gameId);
  }

  closeLobby(): void {
    this.subscriptions.push(
      this.userService.closeLobby(this.gameId, localStorage.getItem('username') ?? '').subscribe({
        next: (response) => {
          console.log(response)
          const { message } = response
          if (message === 'closeLobbySuccess') {
            this.gameService.closeLobbySocket(this.gameId, this.username)
            this.router.navigateByUrl('/home')
            this.userService.removeIsHost()
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
    )
  }

  leaveGame(): void {
    this.subscriptions.push(
      this.userService.leaveGame(this.gameId, this.username).subscribe({
        next: (response) => {
          console.log(response)
          const { message } = response
          if (message === 'leaveGameSuccess') {
            this.gameService.leaveGameSocket(this.gameId, this.username)
            this.router.navigateByUrl('/home')
            this.userService.removeIsHost()
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
    )
  }


  findUserByUsername(userList: User[], tempUsername: string): User | null {
    return userList.find(user => user.username === tempUsername) || null;
  }

  getGameData(gameId: string): void {
    this.subscriptions.push(
      this.userService.getGameData(gameId, this.username).subscribe({
        next: (response) => {
          const { message, data, gameData } = response

          if (message === 'getGameDataSuccess' && data) {
            const { players } = data;
            console.log("IMAGE:", players)


            this.users = Object.keys(players).map((i) => {
              const existingUser = this.findUserByUsername(this.users, players[i].username);
              console.log("username:", players[i].username)

              if (existingUser) {
                return existingUser;
              }

              return {
                username: players[i].username,
                imageUrl: players[i].imageUrl,
                cx: this.getRandomX(),
                cy: this.getRandomY(),
                fill: 'green',
                isHost: players[i].username === data.host,
              };
            }).filter((item) => !(new Set(players).has(item.username)));

            if (gameData) {
              this.gameStarted = true;
              this.gameData = gameData.country === "" ? 'spy' : gameData.country;
              this.endTime = new Date(gameData.endTime)
              this.endVoteTime = new Date(gameData.endVoteTime)
              this.animationDone = true

              // If voting is done, then this will set the votes
              if (gameData.votingObject.length !== 0) {
                this.votingDone = true
                this.votingData = gameData.votingObject
                this.foundSpy = gameData.foundSpy
                this.spyName = gameData.spyName
              }
            }
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
    )
  }

  startGame(): void {
    console.log(this.gameId)
    this.userService.startGame(this.gameId, this.gameTimeInS, this.username).subscribe({
      next: (response) => {
        const { message } = response
        if (message === 'startGameSuccess') {
          this.animationDone = false
          this.gameService.startGameSocket(this.gameId, this.username)
          console.log(response)
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getRandomX(): number {
    const minX = 2 * this.circleRadius;
    const maxX = window.innerWidth - minX;
    return Math.random() * (maxX - minX) + minX;
  }

  getRandomY(): number {
    const minY = 2 * this.circleRadius;
    const maxY = (window.innerHeight * 0.7) - minY;
    return Math.random() * (maxY - minY) + minY;
  }

  handleAnimationDone(value: boolean) {
    this.animationDone = value
  }

}
