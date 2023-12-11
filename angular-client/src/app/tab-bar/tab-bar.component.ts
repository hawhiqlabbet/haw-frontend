import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {

  username: string = localStorage.getItem('username') ?? ''
  imageUrl: string = `https://api.multiavatar.com/${this.username}.png`

  @ViewChild('modal') modalElement: ElementRef | undefined;

  ngOnInit() { }

  displayStyle = "none";

  openPopup(): void {
    this.displayStyle = "block";
  }

  closePopup(event: MouseEvent): void {
    if (this.modalElement && !this.modalElement.nativeElement.contains(event.target)) {
      this.displayStyle = 'none';
    }
  }

  generateNewProfile(): void {
    // Logic to generate a new profile image
    // You can implement your functionality here
  }

  saveNewAlias(): void {
    // Logic to save the new alias
    // You can implement your functionality here
  }

  editProfile(): void {

  }
}
