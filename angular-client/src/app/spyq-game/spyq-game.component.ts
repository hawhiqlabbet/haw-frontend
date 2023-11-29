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

  joining: boolean = false

  constructor(private gameService: GameService, private userService: UserService, private router: Router) {
    this.subscriptions.push(
      this.gameService.votingDoneEvent().subscribe((data: any) => {
        const { votingData, foundSpy } = data
        console.log("WEEE", " ", data)
        this.votingData = votingData
        this.foundSpy = foundSpy
        this.votingDoneChanged.emit(true)
      })
    )
  }

  ngOnInit() {
    this.joining = localStorage.getItem('joining') === 'true' ? true : false
    console.log("LOOK HERE ", this.votingData)
  }

  vote(votedFor: string): void {
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
      this.userService.closeLobby(this.gameId).subscribe({
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
  }
}
