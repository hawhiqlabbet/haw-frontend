import { Component, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import { User } from '../room-page/room-page.component';


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

  constructor(private gameService: GameService, private userService: UserService) {
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
}
