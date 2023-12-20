import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hiqlash-game',
  templateUrl: './hiqlash-game.component.html',
  styleUrls: ['./hiqlash-game.component.scss']
})
export class HiqlashGameComponent implements OnInit {
  constructor(private gameService: GameService, private userService: UserService) {

  }

  subscriptions: Subscription[] = []

  myAnswersDone: boolean  = false;
  allAnswersDone: boolean = false;

  answer1: string = ''
  answer2: string = ''

  @Input() timeDifference: number = 0
  @Input() gameId: string = ''
  @Input() username: string = ''
  @Input() gameData: any

  ngOnInit() {
    console.log(this.gameData)
    console.log(this.gameData.prompts[0])



    this.subscriptions.push(
      this.gameService.hiQlashAnswersDoneEvent().subscribe((data: any) => {
        this.allAnswersDone = true;
      })
    )
  }

  submitAnswers() {
    this.myAnswersDone = true;
    console.log("wewo")
    this.subscriptions.push(
      this.userService.hiQlashAnswer(this.gameId, this.username, this.answer1, this.answer2).subscribe((data: any) => {
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
