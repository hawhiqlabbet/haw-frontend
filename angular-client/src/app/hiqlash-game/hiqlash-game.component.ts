import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  hasVoted: boolean
  hasAllVoted: boolean
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

  myVoteDone: boolean = false
  allVotesDone: boolean = false

  gameDone: boolean = false;

  votingData: any[] = []
  playerScores: any[] = []

  @Input() timeDifference: number = 0
  @Input() timeDifferenceVote: number = 0
  @Input() gameId: string = ''
  @Input() gameChoice: string = ''
  @Input() username: string = ''
  @Input() gameData: GameData = {
    endTime: 0,
    endVoteTime: 0,
    endTimeConst: 0,
    endVoteTimeConst: 0,
    hasAnswered: false,
    hasAllAnswered: false,
    hasVoted: false,
    hasAllVoted: false,
    prompts: [],
    votingObject: [],
    currentPlayers: ['', ''],
    currentAnswers: ['', ''],
    currentPrompt: ''
  };

  @Output() resetRoom: EventEmitter<boolean> = new EventEmitter<boolean>

  promptAnswer1: string = ''
  promptAnswer2: string = ''

  showPromptBlock: boolean = true

  currentAnswers: string[] = ['', '']
  currentPlayers: string[] = ['', '']
  currentPrompt: string = ''
  


  ngOnInit() {
    this.myAnswersDone = this.gameData.hasAnswered ?? false
    this.allAnswersDone = this.gameData.hasAllAnswered ?? false

    this.myVoteDone = this.gameData.hasVoted ?? false
    this.allVotesDone = this.gameData.hasAllVoted ?? false

    if (this.timeDifference < 0 || this.allAnswersDone)
      this.showPromptBlock = false
    else
      this.showPromptBlock = true

    this.currentPlayers = this.gameData.currentPlayers ?? ['', '']
    this.currentAnswers = this.gameData.currentAnswers ?? ['', '']
    this.currentPrompt = this.gameData.currentPrompt ?? ''

    this.subscriptions.push(
      this.gameService.hiQlashAnswersDoneEvent().subscribe((data: any) => {
        this.showPromptBlock = false;
      })
    )

    this.subscriptions.push(
      this.gameService.hiQlashVotingDoneEvent().subscribe((data: any) => {
        const { votingData } = data
        this.votingData = votingData
        this.allVotesDone = true;
      })
    )

    this.subscriptions.push(
      this.gameService.hiQlashPromptUpdateEvent().subscribe((data: any) => {
        const { players, promptAnswers, prompt } = data
        this.myVoteDone = false;
        this.currentPlayers = players
        this.currentAnswers = promptAnswers
        this.currentPrompt = prompt
      })
    )

    this.subscriptions.push(
      this.gameService.hiQlashEndEvent().subscribe((data: any) => {
        const { playerScores } = data
        this.playerScores = playerScores
        this.gameDone = true
      })
    )

    this.subscriptions.push(
      this.gameService.newRoundEvent().subscribe((data: any) => {
        this.resetRoom.emit()
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
        }
      })
    )
  }

  vote(choice: number): void {
    this.myVoteDone = true;

    this.subscriptions.push(
      this.userService.hiQlashVote(this.gameId, this.username, this.currentPlayers[choice]).subscribe((data: any) => {
        const { message } = data
        if (message === 'hiQlashVoteSuccessDone') {
          this.gameService.reportHiQlashVotingDone(this.gameId);
        }
        setTimeout(() => {
        })
      })
    )
  }
}
