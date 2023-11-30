
import { Component, OnInit, Input } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-result-container',
  templateUrl: './result-container.component.html',
  styleUrls: ['./result-container.component.scss']
})
export class ResultContainerComponent implements OnInit {
  @Input() votingData: any[] = [];
  @Input() spyName: string = '';
  @Input() foundSpy: boolean = false


  showResultText: boolean = false;

  ngOnInit() {
    setTimeout(() => {
      this.fadeOutResultText();
    }, 3000);
  }

  fadeOutResultText() {
    anime({
      targets: '#spyNotFound',
      opacity: 0,
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        this.showResultText = true;
      }
    });
  }
}
