import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hiqlash-game',
  templateUrl: './hiqlash-game.component.html',
  styleUrls: ['./hiqlash-game.component.scss']
})
export class HiqlashGameComponent implements OnInit {

  @Input() timeDifference: number = 0

  @Input() gameData: any

  ngOnInit() {
    console.log(this.gameData)
    console.log(this.gameData.prompts[0])

  }
  submitAnswers() {

  }

}
