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

  }

  onClickSubmit(result: string) {
    console.log("You have entered : " + result);
    this.socketService.login(result).subscribe(
      response => {
        // Handle successful response
        console.log(response);
      },
      error => {
        // Handle error response
        console.error(error);
      }
    );
    this.router.navigate(['/home']);
  }

}