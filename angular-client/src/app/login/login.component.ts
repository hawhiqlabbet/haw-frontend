import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private socketService: SocketService) { }


  ngOnInit(): void {
    // Listen for socket events
    this.socketService.socket.fromEvent('event_name').subscribe((data) => {
      // Handle the data received from the server
      console.log(data);
    });
  }

  onClickSubmit(result: string) {
    console.log("You have entered : " + result);
    this.socketService.emitUsername(result);
    this.router.navigate(['/home']);
  }

}