import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {

  username: string = localStorage.getItem('username') ?? ''
  imageUrl: string = `https://api.multiavatar.com/${this.username}.png`
  
  constructor(private userService: UserService) {}

}
