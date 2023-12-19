import { Component, ElementRef, OnInit, Input } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() timeDifference: number = 100;
  initialTimeDifference: number = 0;
  isWarning: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.initialTimeDifference = this.timeDifference;
  }

  get progressPercentage(): number {
    return ((this.initialTimeDifference - this.timeDifference) / this.initialTimeDifference) * 100;
  }

  // ngAfterViewInit(): void {
  //   const progressBar = this.elementRef.nativeElement.querySelector('.progress-bar');
  //   let currentWidth = 0; // Starting width
  //   const targetWidth = 100;
  //   const duration = 4000;

  //   anime({
  //     targets: progressBar,
  //     width: `${targetWidth}%`,
  //     easing: 'linear',
  //     update: (anim) => {
  //       currentWidth = anim.progress * targetWidth / 100;
  //       this.isWarning = currentWidth >= 90;
  //     },
  //     duration: duration
  //   });
  // }
}
