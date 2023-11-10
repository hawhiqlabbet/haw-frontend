import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private socketService: SocketService, private router: Router) {}



  host(): void {
    this.socketService.host().subscribe({
      next: (data) => {
        this.router.navigate(['games'], { state: { code: data.code } })
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
