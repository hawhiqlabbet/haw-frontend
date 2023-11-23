<<<<<<< HEAD
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
=======
import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
>>>>>>> a25121ba994a176c3c54b4e550716136aa3df1c8
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-animated-game-text',
  templateUrl: './animated-game-text.component.html',
  styleUrls: ['./animated-game-text.component.scss']
})
export class AnimatedGameTextComponent implements AfterViewInit {

  @Output() animationDone: EventEmitter<boolean> = new EventEmitter<boolean>


  ngAfterViewInit(): void {
    const animation = {
      opacityIn: [0, 1],
      scaleIn: [0.2, 1],
      scaleOut: 3,
      durationIn: 800,
      durationOut: 600,
      delay: 500
    };

    anime.timeline({ loop: false })
      .add({
        targets: '.white-heading .text-object-1',
        opacity: animation.opacityIn,
        scale: animation.scaleIn,
        duration: animation.durationIn
      }).add({
        targets: '.white-heading .text-object-1',
        opacity: 0,
        scale: animation.scaleOut,
        duration: animation.durationOut,
        easing: "easeInExpo",
        delay: animation.delay
      }).add({
        targets: '.white-heading .text-object-2',
        opacity: animation.opacityIn,
        scale: animation.scaleIn,
        duration: animation.durationIn
      }).add({
        targets: '.white-heading .text-object-2',
        opacity: 0,
        scale: animation.scaleOut,
        duration: animation.durationOut,
        easing: "easeInExpo",
        delay: animation.delay
      }).add({
        targets: '.white-heading .text-object-3',
        opacity: animation.opacityIn,
        scale: animation.scaleIn,
        duration: animation.durationIn
      }).add({
        targets: '.white-heading .text-object-3',
        opacity: 0,
        scale: animation.scaleOut,
        duration: animation.durationOut,
        easing: "easeInExpo",
        delay: animation.delay
      }).add({
        targets: '.white-heading ',
        opacity: 0,
        duration: 500,
        delay: 500,
        complete: () => {
          this.animationDone.emit(true);
          console.log('done')
        }
      })
  }

}
