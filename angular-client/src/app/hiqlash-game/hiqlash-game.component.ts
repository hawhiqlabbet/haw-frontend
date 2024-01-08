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
  currentPlayers: string[]
  currentAnswers: string[]
  currentPrompt: string
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
  @Input() timeDifferenceVote: number = 0
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
    votingObject: [],
    currentPlayers: [],
    currentAnswers: [],
    currentPrompt: ""
  };

  promptAnswer1: string = ''
  promptAnswer2: string = ''

  showPromptBlock: boolean = true

  currentAnswers: string[] = []
  currentPlayers: string[] = []
  currentPrompt: string = ''

  // showPromptBlock: boolean = false

  vote(choice: string): void {
    console.log("pressed ", choice)
  }

  ngOnInit() {
    console.log("WEEE ", this.gameData)
    console.log(this.timeDifference)
    this.myAnswersDone = this.gameData.hasAnswered ?? false
    this.allAnswersDone = this.gameData.hasAllAnswered ?? false

    if (this.timeDifference < 0 || this.allAnswersDone)
      this.showPromptBlock = false
    else
      this.showPromptBlock = true

    this.currentPlayers = this.gameData.currentPlayers
    this.currentAnswers = this.gameData.currentAnswers
    this.currentPrompt = this.gameData.currentPrompt

    console.log(this.myAnswersDone)
    console.log(this.allAnswersDone)
    console.log(this.showPromptBlock)

    this.subscriptions.push(
      this.gameService.hiQlashAnswersDoneEvent().subscribe((data: any) => {
        this.showPromptBlock = false;
        console.log('all answering done')

      })
    )

    this.subscriptions.push(
      this.gameService.hiQlashPromptUpdateEvent().subscribe((data: any) => {
        const { players, promptAnswers, prompt } = data
        this.currentPlayers = players
        this.currentAnswers = promptAnswers
        this.currentPrompt = prompt
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
