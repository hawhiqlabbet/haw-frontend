import { Component } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private socketService: SocketService){

  }

  host(): void {
    this.socketService.host().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
