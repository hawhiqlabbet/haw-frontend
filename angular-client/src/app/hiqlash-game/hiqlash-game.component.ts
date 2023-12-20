import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hiqlash-game',
  templateUrl: './hiqlash-game.component.html',
  styleUrls: ['./hiqlash-game.component.scss']
})
export class HiqlashGameComponent implements OnInit {

  @Input() timeDifference: number = 0
  // timeDifference: number = 10
  promptsSaved: boolean = false //this we need to fetch from server
  @Input() gameData: any
  // gameData: any = {
  //   "username": "hello",
  //   "gameId": "XKKM",
  //   "endTime": 29993,
  //   "endVoteTime": 30000,
  //   "prompts": [
  //     "Do you like Jazz8?",
  //     "Do you like Jazzis?"
  //   ]
  // }

  ngOnInit() {
    console.log(this.gameData.endTimeConst)
    console.log(this.gameData.prompts[0])

  }
  submitAnswers() {
    this.promptsSaved = true
  }

}
