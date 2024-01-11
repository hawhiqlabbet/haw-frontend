import { ActivatedRoute } from '@angular/router';
import { Component, ChangeDetectorRef } from '@angular/core'
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
  closePopupHandler: () => void;

  subscriptions: Subscription[] = []
  users: User[] = [];
  username: string = this.userService.getUsername() ?? ''
  imageUrl: string = this.userService.getImageUrl() ?? ''
  isHost: boolean = this.userService.getIsHost()
  circleRadius = 21.5
  gameId: string = ''
  gameChoice: string = ''
  gameStarted = false
  gameData: any
  gameTimeInMS = 60000 * 2
  category = ""
  timeDifference: number = 0
  timeDifferenceVote: number = 0
  animationDone = false

  votingDone: boolean = false
  votingData: any = []

  gotData: boolean = false;

  selectedInfo: string = '';
  displayInfo: string = ""
  isOverlayActive: boolean = false;
  

  constructor(private gameService: GameService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {
    this.closePopupHandler = () => {};
  }
  
  handleSettingsChange(event: { selectedCategory: string, selectedTime: number }): void {
    this.category = event.selectedCategory;
    this.gameTimeInMS = event.selectedTime;
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

  ngOnInit(): void {
    this.gotData = false;
    this.username = localStorage.getItem("username") ?? ''
    this.imageUrl = localStorage.getItem("imageUrl") ?? ''
    this.isHost = localStorage.getItem("isHost") == 'true' ? true : false

    this.subscriptions.push(
      this.activatedRoute.params.subscribe(params => {
        this.gameId = params['gameId']
      })
    )

    if (this.userService.getIsHost())
      this.gameService.hostGameSocketConnect(this.gameId, this.username, this.gameChoice)
    else
      this.gameService.joinGameSocketConnect(this.gameId, this.username, this.imageUrl)

    //?????
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
          if (this.isHost && (this.gameChoice === "SpyQ"))
            this.gameService.reportSpyQVotingDone(this.gameId)
        }
      })
    )

    this.subscriptions.push(
      this.gameService.hostStartedEvent().subscribe((data: any) => {
        const { gameData, gameChoice } = data;
        this.gameChoice = gameChoice
        this.gameStarted = true;
        this.gameData = gameData;
      })
    )

    this.subscriptions.push(
      this.gameService.connectSocket().subscribe(() => {
        //this.ngOnInit();
      })
    )

    // Attach the beforeunload event listener to handle disconnection on window close/refresh
    window.addEventListener('beforeunload', () => {
      this.gameService.disconnectBeforeUnload(this.username);
    });

    // On init, refresh the perception of players in the lobby
    this.getGameData(this.gameId);
  }

  closeLobby(): void {
    this.subscriptions.push(
      this.userService.closeLobby(this.gameId, localStorage.getItem('username') ?? '').subscribe({
        next: (response) => {
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
            const { players, gameChoice } = data;
            this.gameChoice = gameChoice;
            console.log("PLAYERS", players)
            // this.players = players

            this.users = Object.keys(players).map((i) => {
              const existingUser = this.findUserByUsername(this.users, players[i].username);

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
              this.gameStarted = true
              //  this.gameChoice = gameData.gameChoice
              this.gameData = gameData
              this.animationDone = true

              // If voting is done, then this will set the votes
              /*
              if (gameData.votingObject.length !== 0) {
                this.votingDone = true
                this.votingData = gameData.votingObject
              }
              */
            }

            setTimeout(() => {
              this.gotData = true;
              this.changeDetectorRef.detectChanges();
            }, 1300);
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
    )
  }

  startGame(): void {
    this.userService.startGame(this.gameId, this.gameTimeInMS, this.username, this.category).subscribe({
      next: (response) => {
        const { message } = response
        if (message === 'startGameSuccess') {
          this.animationDone = false
          this.gameService.startGameSocket(this.gameId, this.username)
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

  getNewData(): void {
    this.getGameData(this.gameId);
  }

  resetRoom(): void {


    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });

  }

  openInfoPopup(event: Event): void {
    var overlay = document.getElementById('info-overlay');
    if (!overlay) {
      return;
    }

    this.isOverlayActive = true;
    overlay.style.display = 'block';

    // Store the function reference to use when removing the event listener
    this.closePopupHandler = () => this.closeInfoPopup();

    // Add an event listener to close the overlay when clicking anywhere on the screen
    document.addEventListener('click', this.closePopupHandler);

    // Stop the event propagation to prevent immediate closing
    event.stopPropagation();
  }

  closeInfoPopup(): void {
    var overlay = document.getElementById('info-overlay');
    if (!overlay)
      return;

    this.isOverlayActive = false;
    overlay.style.display = 'none';

    // Remove the event listener using the stored function reference
    document.removeEventListener('click', this.closePopupHandler);
  }
}
