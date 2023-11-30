import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import { User } from '../room-page/room-page.component';
import { Router } from '@angular/router'


@Component({
  selector: 'app-spyq-game',
  templateUrl: './spyq-game.component.html',
  styleUrls: ['./spyq-game.component.scss']
})
export class SpyqGameComponent {
  subscriptions: Subscription[] = []

  @Input() gameData: any;
  @Input() gameId: string = ''
  @Input() username: string = '';
  @Input() users: User[] = [];
  @Input() timeDifference: number = 0;
  @Input() timeDifferenceVote: number = 0;

  @Input() votingDone: boolean = false
  @Output() votingDoneChanged: EventEmitter<boolean> = new EventEmitter<boolean>
  @Input() votingData: any[] = [];
  @Input() foundSpy: boolean = false
  @Input() spyName: string = ""

  joining: boolean = false
  isFlipped: boolean = false
  userHasVoted: boolean = false

  // Mock data to use for testing purpose
  // gameData: any;
  // gameId: string = '123';
  // username: string = 'Emelie';
  // users: User[] = [
  //   {
  //     username: 'Lucas',
  //     imageUrl: 'https://example.com/image1.png',
  //     cx: 100,
  //     cy: 100,
  //     fill: '#FFA500',
  //     isHost: true
  //   },
  //   {
  //     username: 'Emelie',
  //     imageUrl: 'https://example.com/image2.png',
  //     cx: 200,
  //     cy: 200,
  //     fill: '#00FF00',
  //     isHost: false
  //   },
  //   {
  //     username: 'David',
  //     imageUrl: 'https://example.com/image1.png',
  //     cx: 100,
  //     cy: 100,
  //     fill: '#FFA500',
  //     isHost: false
  //   },
  //   {
  //     username: 'Siri',
  //     imageUrl: 'https://example.com/image2.png',
  //     cx: 200,
  //     cy: 200,
  //     fill: '#00FF00',
  //     isHost: false
  //   },
  //   {
  //     username: 'Inger',
  //     imageUrl: 'https://example.com/image1.png',
  //     cx: 100,
  //     cy: 100,
  //     fill: '#FFA500',
  //     isHost: false
  //   },
  //   {
  //     username: 'Anton',
  //     imageUrl: 'https://example.com/image2.png',
  //     cx: 200,
  //     cy: 200,
  //     fill: '#00FF00',
  //     isHost: false
  //   },
  //   {
  //     username: 'Sofie',
  //     imageUrl: 'https://example.com/image1.png',
  //     cx: 100,
  //     cy: 100,
  //     fill: '#FFA500',
  //     isHost: false
  //   },
  //   {
  //     username: 'Matthias',
  //     imageUrl: 'https://example.com/image2.png',
  //     cx: 200,
  //     cy: 200,
  //     fill: '#00FF00',
  //     isHost: false
  //   },
  // ];
  // timeDifference: number = 100;
  // timeDifferenceVote: number = 50;
  // votingDone: boolean = false;
  // votingData: any[] = [
  //   { player: 'David', votes: 1 },
  //   { player: 'emelie', votes: 5 },
  //   { player: 'lucas', votes: 0 },
  //   { player: 'Matthidddswdswsddsdsdsas', votes: 1 },
  //   { player: 'Inger', votes: 1 },
  //   { player: 'Anton', votes: 1 },
  //   { player: 'Sofie', votes: 1 },
  //   { player: 'Matthias', votes: 1 },
  //   { player: 'Inger', votes: 1 },
  //   { player: 'Anton', votes: 1 },
  //   { player: 'Sofie', votes: 1 },
  //   { player: 'Matthidddswdswsddsdsdsas', votes: 1 },
  // ];
  // foundSpy: boolean = true;
  // joining: boolean = false;
  // spyName: string = 'emelie'

  constructor(private gameService: GameService, private userService: UserService, private router: Router) {
    this.subscriptions.push(
      this.gameService.votingDoneEvent().subscribe((data: any) => {
        const { votingData, foundSpy, spyName } = data
        this.votingData = votingData
        this.foundSpy = foundSpy
        this.spyName = spyName
        this.votingDoneChanged.emit(true)

      })
    )
  }

  flipCard(): void {
    console.log(this.isFlipped)
    this.isFlipped = !this.isFlipped;
    // if (this.isFlipped) {
    //   setTimeout(() => {
    //     this.isFlipped = false;
    //   }, 1000);
    // }
  }

  ngOnInit() {
    // this.joining = localStorage.getItem('joining') === 'true' ? true : false
    console.log("LOOK HERE ", this.votingData)
  }

  vote(votedFor: string): void {
    this.userHasVoted = true

    this.subscriptions.push(
      this.userService.spyQVote(this.gameId, this.username, votedFor).subscribe((data: any) => {
        const { message } = data
        if (message === 'spyQVoteSuccessDone') {
          this.gameService.reportSpyQVotingDone(this.gameId)
          console.log('Voting done')
        }
        setTimeout(() => {
          console.log("Voted")
        })
      })
    )
  }

  closeLobby(): void {
    this.subscriptions.push(
      this.userService.closeLobby(this.gameId, this.username).subscribe({
        next: (response) => {
          console.log(response)
          const { message } = response
          if (message === 'closeLobbySuccess') {
            this.gameService.closeLobbySocket(this.gameId, this.username)
            this.router.navigateByUrl('/home')
            localStorage.removeItem('joining')
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
    )
  }

  newRound(): void {
    console.log("TODO")
    console.log(this.votingData)
  }
}
