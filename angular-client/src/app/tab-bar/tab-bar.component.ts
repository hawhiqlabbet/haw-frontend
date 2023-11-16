import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {

  imageUrl: string = ''
  
  constructor(private userService: UserService) {
    this.userService.getImageUrl.subscribe(imageUrl => this.imageUrl = imageUrl)
  }

}
