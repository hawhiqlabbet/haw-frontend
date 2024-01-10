import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import { User } from '../room-page/room-page.component';
import { Router } from '@angular/router'

interface GameData {
  country: string
  endTime: number
  endVoteTime: number
  endTimeConst: number
  endVoteTimeConst: number
  foundSpy: boolean
  spyName: string
  votingObject: any[]
}

@Component({
  selector: 'app-spyq-game',
  templateUrl: './spyq-game.component.html',
  styleUrls: ['./spyq-game.component.scss']
})
export class SpyqGameComponent {
  subscriptions: Subscription[] = []

  @Input() gameData: GameData = {
    country: '',
    endTime: 0,
    endVoteTime: 0,
    endTimeConst: 0,
    endVoteTimeConst: 0,
    foundSpy: false,
    spyName: '',
    votingObject: []
  };

  @Input() gameChoice: string = ''
  @Input() gameId: string = ''
  @Input() username: string = ''
  @Input() users: User[] = []
  @Input() timeDifference: number = 0
  @Input() timeDifferenceVote: number = 0
  @Input() votingData: any[] = []
  @Output() getNewData: EventEmitter<string> = new EventEmitter<string>
  @Output() resetRoom: EventEmitter<boolean> = new EventEmitter<boolean>

  votingDone: boolean = false
  isFlipped: boolean = false
  userHasVoted: boolean = false
  spyName: string = ''
  foundSpy: boolean = false

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

  constructor(private gameService: GameService, private userService: UserService) {
  }

  ngOnInit() {
    if(this.gameData.votingObject && this.gameData.votingObject.length > 0) {
      this.votingDone = true
    }

    this.votingData = this.gameData.votingObject ?? []
    this.spyName = this.gameData.spyName
    this.foundSpy = this.gameData.foundSpy


    this.subscriptions.push(
      this.gameService.votingDoneEvent().subscribe((data: any) => {
        const { votingData, foundSpy, spyName } = data
        this.votingData = votingData
        this.foundSpy = foundSpy
        this.spyName = spyName
        this.votingDone = true

        this.getNewData.emit("Get new data mr parent")
      })
    )

    this.subscriptions.push(
      this.gameService.newRoundEvent().subscribe((data: any) => {
        this.resetRoom.emit()
      })
    )
    
    if(this.gameData.endVoteTime < 0 && localStorage.getItem('isHost') === 'true') {
      this.gameService.reportSpyQVotingDone(this.gameId)
    }
  }
  

  flipCard(): void {
    console.log(this.isFlipped)
    this.isFlipped = !this.isFlipped;

  }


  vote(votedFor: string): void {
    this.userHasVoted = true

    this.subscriptions.push(
      this.userService.spyQVote(this.gameId, this.username, votedFor).subscribe((data: any) => {
        const { message } = data
        if (message === 'spyQVoteSuccessDone') {
          this.gameService.reportSpyQVotingDone(this.gameId)
          console.log('Voting done')
          this.votingDone = true
        }
        setTimeout(() => {
          console.log("Voted")
        })
      })
    )
  }

}
