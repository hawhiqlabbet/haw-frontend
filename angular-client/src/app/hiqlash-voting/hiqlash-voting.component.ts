import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import { User } from '../room-page/room-page.component';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hiqlash-voting',
  templateUrl: './hiqlash-voting.component.html',
  styleUrls: ['./hiqlash-voting.component.scss']
})

export class HiqlashVotingComponent implements OnInit {
  @Input() users: User[] = [
    { username: 'emelie', imageUrl: 'https://api.multiavatar.com/ctpjso33u.png', cx: 0, cy: 0, fill: 'blue', isHost: true },
    { username: 'david', imageUrl: 'https://api.multiavatar.com/ctpjso33uds.png', cx: 0, cy: 0, fill: 'red', isHost: false },
    { username: 'carl', imageUrl: 'https://api.multiavatar.com/ctpjso33uds.png', cx: 0, cy: 0, fill: 'red', isHost: false },
    { username: 'Player1', imageUrl: 'https://api.multiavatar.com/ctpjso33usa.png', cx: 0, cy: 0, fill: 'blue', isHost: true },
    { username: 'Player2', imageUrl: 'https://api.multiavatar.com/ctpjsdso33uds.png', cx: 0, cy: 0, fill: 'red', isHost: false },
  ]
  @Input() endVoteTimeConst: number = 0
  @Input() timeDifferenceVote: number = 0;
  @Input() currentAnswers: string[] = ['Answer 1 Answer 1 Answer 1 Answer 1 Answer 1 Answer 1 Answer 1 Answer 1', 'Answer 2']
  @Input() currentPrompt: string = 'Prompt'
  @Input() currentPlayers: string[] = ['Player1', 'Player2']
  @Input() myVoteDone: boolean = false


  @Output() voteEvent = new EventEmitter<number>()

  playerImages: string[] = ['', '']
  votedForOne: string[] = ['emelie', 'david']
  votedForTwo: string[] = ['emelie', 'david']
  allVotesDone: boolean = false

  startSequence: any
  chooseSequence: any
  winnerSequence: any

  constructor(private gameService: GameService) {
  }

  subscriptions: Subscription[] = []


  ngOnInit(): void {

  //  if (this.currentAnswers && this.currentAnswers.length >= 2) {
  //    this.startAnimation()
  //  }

    this.subscriptions.push(
      this.gameService.hiQlashVotingDoneEvent().subscribe((data: any) => {
        const { votedForOne, votedForTwo } = data
        this.votedForOne = votedForOne
        this.votedForTwo = votedForTwo

        this.allVotesDone = true;

        setTimeout(() => {
          this.winnerAnimation()
        }, 0)
      })
    )


    this.subscriptions.push(
      this.gameService.hiQlashPromptUpdateEvent().subscribe((data: any) => {
        console.log("starting animation")
        if(this.startSequence) {
        console.log('removing start animation')
        this.startSequence.restart();
        this.startSequence.pause();
        }
        if(this.chooseSequence) {
          console.log('removing choose animation')
          this.chooseSequence.restart();
          this.chooseSequence.pause();
        }
        if(this.winnerSequence) {
          console.log('removing winner animation')
          this.winnerSequence.restart();
          this.winnerSequence.pause();
        }

        this.allVotesDone = false;
        this.startAnimation();
      })
    )
  }

  getImageUrl(username: string): string {
    const user = this.users.find((user) => user.username === username);
    return user ? user.imageUrl : '';
  }

  getWinnerUsername(): string {
    if (this.votedForOne.length > this.votedForTwo.length) {
      return `Snyggt jobbat ${this.currentPlayers[0]}!`;
    } else if (this.votedForOne.length < this.votedForTwo.length) {
      return `Snyggt jobbat ${this.currentPlayers[1]}!`;
    }
    return 'Det är oavgjort!'
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // if (changes['myVoteDone']) {
  //   //   const currentValue = changes['myVoteDone'].currentValue;
  //   //   const previousValue = changes['myVoteDone'].previousValue;

  //   //   if (currentValue !== previousValue && currentValue === false) {
  //   //     this.startAnimation()
  //   //   }
  //   // }

  //   if (changes['allVotesDone'] && changes['allVotesDone'].currentValue) {

  //     this.winnerAnimation();
  //     console.log("YUOYUO")

  //   }
  // }

  private startAnimation(): void {
    console.log("start animation")
    this.startSequence = anime.timeline({ loop: false })
      .add({
        targets: '.answer-row-1 .container-1',
        translateX: ['-100vw', '0%'],
        scale: 1,
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad'
      }).add({
        targets: '.answer-row-2 .container-2',
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
    this.chooseSequence = anime.timeline({ loop: false })
        .add({
          targets: '.answer-row-2 .container-2',
          opacity: [1, 0.2],
          duration: 1000,
          easing: 'easeOutQuad'
        })
        .add({
          targets: '.answer-row-1 .container-1',
          scale: 1.2,
          duration: 1000,
          easing: 'easeOutQuad'
        }, 0)

    }
    else {
    this.chooseSequence = anime.timeline({ loop: false })
        .add({
          targets: '.answer-row-1 .container-1',
          opacity: [1, 0.2],
          duration: 1000,
          easing: 'easeOutQuad'
        })
        .add({
          targets: '.answer-row-2 .container-2',
          scale: 1.2,
          duration: 1000,
          easing: 'easeOutQuad'
        }, 0)

    }

  }

  private winnerAnimation() {

    //const timeline = anime.timeline({ loop: false })
    this.winnerSequence = anime.timeline({ loop: false })
      .add({
        targets: '.overlay-box-info',
        opacity: [0, 1],
        duration: 1500,
      })
      .add({
        targets: '.overlay-box-info',
        opacity: [1, 0],
        duration: 1500,
      })
      .add({
        targets: '.answer-row-1 .container-1',
        opacity: [0.2, 1],
        scale: 1,
        duration: 0,
      })
      .add({
        targets: '.answer-row-2 .container-2',
        opacity: [0.2, 1],
        scale: 1,
        duration: 0,
      })
      .add({
        targets: '.answer-row-1 .img-player1',
        opacity: [0, 1],
        easing: 'easeInExpo',
        duration: 500
      })
      .add({
        targets: '.answer-row-2 .img-player2',
        opacity: [0, 1],
        easing: 'easeInExpo',
        duration: 500
      })
      .add({
        targets: '.answer-row-1 .container-1 .small-images-container-1',
        opacity: [0, 1],
        easing: 'easeInExpo',
        duration: 500
      })
      .add({
        targets: '.answer-row-2 .container-2 .small-images-container-2',
        opacity: [0, 1],
        easing: 'easeInExpo',
        duration: 500
      })


    if (this.votedForOne.length > this.votedForTwo.length) {
      this.winnerSequence.add({
        targets: '.answer-row-1',
        translateY: ['20%', '-20%', '20%', '-20%', '20%', '-20%', '50%'],
        opacity: 1,
        scale: 1.2,
        duration: 500,
        easing: 'easeInExpo'
      })
        .add({
          targets: '.answer-row-2',
          translateY: ['0%', '10%'],
          opacity: [1, 0],
          duration: 500,
          scale: 0.5,
          easing: 'easeOutQuad',
          rotate: '1turn'
        })
    } else if (this.votedForOne.length < this.votedForTwo.length) {
      this.winnerSequence.add({
        targets: '.answer-row-2',
        translateY: ['-20%', '20%', '-20%', '20%', '-20%', '20%', '-50%'],
        opacity: 1,
        scale: 1.2,
        duration: 500,
        easing: 'easeInExpo'
      })
        .add({
          targets: '.answer-row-1',
          translateY: ['0%', '-10%'],
          opacity: [1, 0],
          duration: 500,
          scale: 0.5,
          easing: 'easeOutQuad',
          rotate: '1turn'
        })

    }
    this.winnerSequence.add({
      targets: '.overlay-box-result',
      opacity: [0, 1],
      duration: 3000,
    });

    // this.startAnimation()

  }

  vote(choice: number): void {
    console.log("PRESSED")
    if (!this.myVoteDone) {
      this.voteEvent.emit(choice);
      this.chooseAnswerAnimation(choice)
    }
  }


}
