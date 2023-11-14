// hosting-card.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-hosting-card',
  templateUrl: './hosting-card.component.html',
  styleUrls: ['./hosting-card.component.scss']
})
export class HostingCardComponent {
  isFlipped: boolean = false;

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }
}
