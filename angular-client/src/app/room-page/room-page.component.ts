import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit {
  @ViewChild('floatingCircle') floatingCircle!: ElementRef;

  ngOnInit(): void {
    // Get the circle element
    const circle = this.floatingCircle.nativeElement;

    // Set initial position
    anime.set(circle, {
      translateX: anime.random(0, window.innerWidth - 50),
      translateY: anime.random(0, window.innerHeight - 50),
    });

    // Animate the circle's movement
    anime({
      targets: circle,
      translateX: () => anime.random(0, window.innerWidth - 50),
      translateY: () => anime.random(0, window.innerHeight - 50),
      easing: 'easeInOutQuad',
      duration: 3000,
      loop: true,
    });
  }
}
