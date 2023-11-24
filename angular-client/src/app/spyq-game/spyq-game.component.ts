import { Component, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-spyq-game',
  templateUrl: './spyq-game.component.html',
  styleUrls: ['./spyq-game.component.scss']
})
export class SpyqGameComponent {

  @Input() data: any;
  @Input() username: string | null = '';
  @Input() timeDifference: number = 0
  isSpy: boolean = false

  ngOnInit(): void {
    console.log(this.username)

    console.log(this.data)

    if (this.data === 'spy') {
      this.isSpy = true
    }
  }

}
