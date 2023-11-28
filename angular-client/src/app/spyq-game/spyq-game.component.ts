import { Component, Input } from '@angular/core';
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
  @Input() votingData: any = []
  @Input() foundSpy: boolean = false

  joining: string = ""

  constructor(private gameService: GameService, private userService: UserService, private router: Router) {
    this.subscriptions.push(
      this.gameService.votingDoneEvent().subscribe((data: any) => {
        const {votingData, foundSpy} = data
        console.log(data)
        this.votingData = votingData
        this.foundSpy   = foundSpy
        this.votingDone = true
      })
    )
  }

  ngOnInit() {
      this.joining = localStorage.getItem('joining') ?? "false"
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

  toLobby(): void {
    console.log("TODO")
  }
}
