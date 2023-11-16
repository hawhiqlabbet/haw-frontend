


import { Component, OnInit, Input, ElementRef } from '@angular/core';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-user-circle',
  templateUrl: './user-circle.component.html',
  styleUrls: ['./user-circle.component.scss']
})
export class UserCircleComponent implements OnInit {

  @Input() cx: string | null = '50';
  @Input() cy: string | null = '50';
  @Input() fill: string = '#1D39C4';
  @Input() radius: number | null = 21.5;

  lastPositionX = 50;
  lastPositionY = 50;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    // this.animateCircle();
  }

  animateCircle(): void {
    const circleElement = this.elementRef.nativeElement.querySelector('#box1');
    const boundaryElement = this.elementRef.nativeElement.parentElement; // Change this line to point to your boundary element

    const boundaryRect = boundaryElement.getBoundingClientRect();
    const minX = boundaryRect.left + 10; // Adjust the padding as needed
    const maxX = boundaryRect.right - 10; // Adjust the padding as needed
    const minY = boundaryRect.top + 10; // Adjust the padding as needed
    const maxY = boundaryRect.bottom - 10; // Adjust the padding as needed

    const randomX = this.getRandomPosition(minX, maxX);
    const randomY = this.getRandomPosition(minY, maxY);

    anime({
      targets: circleElement,
      translateX: [this.cx ?? '50', randomX],
      translateY: [this.cy ?? '50', randomY],
      easing: 'linear',
      duration: 10000, // Adjust the duration to slow down the movement (in milliseconds)
      complete: () => {
        this.cx = circleElement.getAttribute('cx');
        this.cy = circleElement.getAttribute('cy');
        this.animateCircle(); // Trigger a new animation when the current animation completes
      }
    });
  }

  getRandomPosition(min: number, max: number): string {
    return `${Math.floor(Math.random() * (max - min)) + min}`;
  }
}






