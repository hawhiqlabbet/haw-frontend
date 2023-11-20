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



  ngOnInit(): void {
    //this.animateCircle();
  }

  animateCircle(): void {

    anime({
      targets: '#box1',
      translateX: function () {
        return anime.random(0, window.innerWidth - 21.5);
      },
      translateY: function () {
        return anime.random(21.5, window.innerHeight - 21.5);
      },
      easing: 'easeInOutQuad',
      duration: 7000,
      loop: true
    });



  }


}






