import { Component, AfterViewInit } from '@angular/core';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-background-stars',
  templateUrl: './background-stars.component.html',
  styleUrls: ['./background-stars.component.scss']
})
export class BackgroundStarsComponent implements AfterViewInit {
  numStars = 100;
  numStarsArray: number[] = [];
  stars: any[] = [];

  getRandomX = (): number => {
    return Math.floor(Math.random() * window.innerWidth);
  };

  getRandomY = (): number => {
    return Math.floor(Math.random() * window.innerHeight);
  };

  randomRadius = (): number => {
    return Math.random() * 1.4 + 0.6;
  };

  constructor() {
    this.numStarsArray = Array.from({ length: this.numStars }, (_, i) => i);
    this.stars = this.numStarsArray.map(() => ({
      cx: this.getRandomX(),
      cy: this.getRandomY(),
      radius: this.randomRadius(),
    }));
  }

  ngAfterViewInit() {
    this.stars.forEach((_, i) => {
      anime({
        targets: `#star_${i}`,
        opacity: [
          { value: '0', duration: 500 },
          { value: '1', duration: 500 },
          { value: '0', duration: 500 }
        ],
        loop: true,
        easing: 'linear',
        delay: 50 * i
      });
    });
  }
}
