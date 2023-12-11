// hosting-card.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-hosting-card',
  templateUrl: './hosting-card.component.html',
  styleUrls: ['./hosting-card.component.scss']
})
export class HostingCardComponent {

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>

  isFlipped: boolean = false
  gameId: string = ''

  constructor(private router: Router) { }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  hostGame() {
    this.router.navigate(['/games']);
  }

  joinGame(): void {
    this.valueChange.emit(this.gameId);
  }

}
