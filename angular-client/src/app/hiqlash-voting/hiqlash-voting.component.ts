import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-hiqlash-voting',
  templateUrl: './hiqlash-voting.component.html',
  styleUrls: ['./hiqlash-voting.component.scss']
})

export class HiqlashVotingComponent implements OnInit, OnChanges {
  @Input() endVoteTimeConst: number = 0
  @Input() timeDifferenceVote: number = 0;
  @Input() currentAnswers: string[] = ['Answer 1', 'Answer 2']
  @Input() currentPrompt: string = 'Prompt'
  @Input() myVoteDone: boolean = false
  @Output() voteEvent = new EventEmitter<number>();


  ngOnInit(): void {
    console.log(this.currentAnswers)
    if (this.currentAnswers && this.currentAnswers.length >= 2) {
      this.startAnimation()
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['myVoteDone']) {
      const currentValue = changes['myVoteDone'].currentValue;
      const previousValue = changes['myVoteDone'].previousValue;

      if (currentValue !== previousValue && currentValue === false) {
        this.startAnimation()
      }
    }
  }


  private startAnimation(): void {
    anime.timeline({ loop: false })
      .add({
        targets: '.row .container-1',
        translateX: ['-100vw', '0%'],
        scale: 1,
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad'
      }).add({
        targets: '.row .container-2',
        translateX: ['100vw', '0%'],
        opacity: [0, 1],
        scale: 1,
        duration: 1000,
        easing: 'easeOutQuad'
      }).add({
        targets: '.pink-info',
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInExpo'
      })
  }

  private chooseAnswerAnimation(voteIndex: number) {
    if (voteIndex === 0) {
      anime.timeline({ loop: false })
        .add({
          targets: '.row .container-2',
          opacity: [1, 0.2],
          duration: 1000,
          easing: 'easeOutQuad'
        })
        .add({
          targets: '.row .container-1',
          scale: 1.2,
          duration: 1000,
          easing: 'easeOutQuad'
        }, 0);

    }
    else {
      anime.timeline({ loop: false })
        .add({
          targets: '.row .container-1',
          opacity: [1, 0.2],
          duration: 1000,
          easing: 'easeOutQuad'
        })
        .add({
          targets: '.row .container-2',
          scale: 1.2,
          duration: 1000,
          easing: 'easeOutQuad'
        }, 0);
    }

  }

  private winnerAnimation(winnerIndex: number) {

    if (winnerIndex === 0) {
      anime.timeline({ loop: false })
        .add({
          targets: '.row .container-1',
          translateY: ['20%', '-20%', '20%', '-20%', '20%', '-20%', '50%'],
          opacity: 1,
          duration: 1000,
          easing: 'easeOutQuad'
        }).add({
          targets: '.row .container-2',
          translateY: ['0%', '100%'],
          opacity: [1, 0],
          duration: 2000,
          scale: 0.5,
          easing: 'easeOutQuad',
          rotate: '1turn'
        })
    }

    else {
      anime.timeline({ loop: false })
        .add({
          targets: '.row .container-2',
          translateY: ['-20%', '20%', '-20%', '20%', '-20%', '20%', '-50%'],
          opacity: 1,
          duration: 1000,
          easing: 'easeOutQuad'
        }).add({
          targets: '.row .container-1',
          translateY: ['0%', '-100%'],
          opacity: [1, 0],
          duration: 2000,
          scale: 0.2,
          easing: 'easeOutQuad',
          rotate: '1turn'
        })
    }

  }

  vote(choice: number): void {
    if (!this.myVoteDone) {
      this.voteEvent.emit(choice);
      this.chooseAnswerAnimation(choice)
    }
  }
}
