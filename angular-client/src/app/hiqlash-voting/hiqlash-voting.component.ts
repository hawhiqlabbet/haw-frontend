import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-hiqlash-voting',
  templateUrl: './hiqlash-voting.component.html',
  styleUrls: ['./hiqlash-voting.component.scss']
})

export class HiqlashVotingComponent implements OnInit {
  @Input() endVoteTimeConst: number = 0
  @Input() timeDifferenceVote: number = 0;
  @Input() currentAnswers: string[] = ['', '']
  @Input() currentPrompt: string = ''
  @Input() myVoteDone: boolean = false
  @Output() voteEvent = new EventEmitter<number>();

  ngOnInit(): void {
    console.log(this.currentAnswers)
    if (this.currentAnswers && this.currentAnswers.length >= 2) {
      this.startAnimation();
    }
  }

  private startAnimation(): void {
    anime.timeline({ loop: false })
      .add({
        targets: '.row .container-1',
        translateX: ['-100%', '0'],
        opacity: 1,
        duration: 2000,
        easing: 'easeOutQuad'
      }).add({
        targets: '.row .container-2',
        translateX: ['100%', '0'],
        opacity: 1,
        duration: 2000,
        easing: 'easeOutQuad'
      }).add({
        targets: '.text-center .pink-info',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInExpo'
      });
  }

  vote(choice: number): void {
    this.voteEvent.emit(choice);
  }
}
