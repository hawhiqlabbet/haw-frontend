import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

  username: string = this.userService.getUsername() ?? ''
  imageUrl: string = this.userService.getImageUrl() ?? ''

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.username = this.userService.getUsername() ?? ''
    this.imageUrl = this.userService.getImageUrl() ?? ''
  }

  hostGame(gameChoice: string): void {
    this.userService.hostGame(gameChoice, this.username, this.imageUrl).subscribe({
      next: (response) => {
        const { gameId, username, message } = response
        if (message === 'hostGameSuccess') {
          this.userService.setIsHost(true)
          this.router.navigate(['/room', gameId]);
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
