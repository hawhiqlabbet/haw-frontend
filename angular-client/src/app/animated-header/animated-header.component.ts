import { Component, AfterViewInit } from '@angular/core';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-animated-header',
  templateUrl: './animated-header.component.html',
  styleUrls: ['./animated-header.component.scss']
})
export class AnimatedHeaderComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.animateText();
    this.animateHeader();
  }

  private animateHeader(): void {
    anime({
      targets: '#svg-header path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 6000,
      delay: (el, i) => i * 2500,
      direction: 'alternate',
      loop: true
    });
  }

  private animateText(): void {
    const textWrapper = document.querySelector('.ml12');

    if (textWrapper) {
      const textContent = textWrapper.textContent || '';
      textWrapper.innerHTML = textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({ loop: true })
        .add({
          targets: '.ml12 .letter',
          translateX: [40, 0],
          translateZ: 0,
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 2500,
          delay: (el, i) => 500 + 30 * i
        })
        .add({
          targets: '.ml12 .letter',
          translateX: [0, -30],
          opacity: [1, 0],
          easing: "easeInExpo",
          duration: 4100,
          delay: (el, i) => 100 + 30 * i
        });
    } else {
      console.error('Element with class "ml12" not found.');
    }
  }
}
