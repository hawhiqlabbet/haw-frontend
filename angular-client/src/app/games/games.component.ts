import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {



  constructor(private router: Router, private userService: UserService) {}

  hostGame(gameChoice: string): void {
    this.userService.hostGame(gameChoice).subscribe({
      next: (response) => {
        const { gameId, username, message } = response
        if (message === 'hostGameSuccess') {
          localStorage.setItem('joining', 'false')
          this.router.navigate(['/room', gameId]);
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
