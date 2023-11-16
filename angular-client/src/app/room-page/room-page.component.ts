import { Component } from '@angular/core';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent {
  circleRadius = 21.5;

  users = [
    { fill: 'blue', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: '#33FF57', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: 'red', cx: this.getRandomX(), cy: this.getRandomY() },
    { fill: 'yellow', cx: this.getRandomX(), cy: this.getRandomY() }
  ];

  getRandomX(): string {
    const circleRadius = 21.5;
    return `${Math.random() * (window.innerWidth - 2 * circleRadius) + circleRadius}`;
  }

  getRandomY(): string {
    const circleRadius = 21.5;
    return `${Math.random() * (window.innerHeight - 2 * circleRadius) + circleRadius}`;
  }

}
