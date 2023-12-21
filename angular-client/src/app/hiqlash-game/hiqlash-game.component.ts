import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

interface GameData {
  endTime: number
  endVoteTime: number
  endTimeConst: number
  endVoteTimeConst: number
  hasAnswered: boolean
  hasAllAnswered: boolean
  prompts: any[]
  votingObject: any[]
}

@Component({
  selector: 'app-hiqlash-game',
  templateUrl: './hiqlash-game.component.html',
  styleUrls: ['./hiqlash-game.component.scss']
})
export class HiqlashGameComponent implements OnInit {
  constructor(private gameService: GameService, private userService: UserService) {

  }

  subscriptions: Subscription[] = []

  myAnswersDone: boolean = false;
  allAnswersDone: boolean = false;


  @Input() timeDifference: number = 0
  @Input() gameId: string = ''
  @Input() username: string = ''
  @Input() gameData: GameData = {
    endTime: 0,
    endVoteTime: 0,
    endTimeConst: 0,
    endVoteTimeConst: 0,
    hasAnswered: false,
    hasAllAnswered: false,
    prompts: [],
    votingObject: []
  };

  promptAnswer1: string = ''
  promptAnswer2: string = ''

  showPromptBlock: boolean = true

  // showPromptBlock: boolean = false

  vote(choice: string): void {
    console.log("pressed ", choice)
  }

  ngOnInit() {
    console.log(this.gameData.endTimeConst)
    console.log(this.gameData.prompts[0])

    this.showPromptBlock = this.timeDifference > 0

    this.myAnswersDone = this.gameData.hasAnswered;
    this.allAnswersDone = this.gameData.hasAllAnswered;

    this.subscriptions.push(
      this.gameService.hiQlashAnswersDoneEvent().subscribe((data: any) => {
        this.showPromptBlock = false;
        console.log('all answering done')

      })
    )

    this.subscriptions.push(
      this.gameService.hiQlashPromptUpdateEvent().subscribe((data: any) => {
        const { prompt, players, promptAnswers } = data
        console.log("PROMPT: ", prompt, " PLAYERS: ", players, " ANSWERS: ", promptAnswers)
      })
    )
  }



  submitAnswers(): void {
    this.myAnswersDone = true;

    this.subscriptions.push(
      this.userService.hiQlashAnswer(this.gameId, this.username, this.promptAnswer1, this.promptAnswer2).subscribe((data: any) => {
        const { message } = data
        if (message === 'HiQlashAnswerSuccessDone') {
          this.gameService.reportHiQlashAnswersDone(this.gameId)
          console.log('answering done')
        }
        console.log(message)
      })
    )
  }
}
