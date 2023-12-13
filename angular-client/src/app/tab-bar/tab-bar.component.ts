import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../services/user.service';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {

  @Input() username: string = ''
  @Input() imageUrl: string = ''

  @Output() usernameChange: EventEmitter<string> = new EventEmitter<string>()
  @Output() imageUrlChange: EventEmitter<string> = new EventEmitter<string>()

  newImageUrl: string = ''
  newUsername: string = ''

  isAnimating: boolean = false;

  @ViewChild('spinIcon') spinIcon!: ElementRef
  @ViewChild('modal') modalElement: ElementRef | undefined;

  constructor(private userService: UserService) { }

  displayStyle = "none"

  openPopup(): void {
    this.displayStyle = "block"

    this.newImageUrl = this.imageUrl
    this.newUsername = this.username
  }

  closePopup(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const modalContent = this.modalElement?.nativeElement.querySelector('.modal-content');
    const isCloseButton = clickedElement.classList.contains('btn-close');

    if (!modalContent || isCloseButton || !modalContent.contains(clickedElement)) {
      this.displayStyle = 'none';
      this.newImageUrl = this.imageUrl;
      this.newUsername = this.username;
    }
  }

  generateNewProfile(): void {
    this.newImageUrl = this.userService.generateImageUrl()

    this.spinIcon.nativeElement.style.transform = 'rotate(0deg)'

    anime({
      targets: this.spinIcon.nativeElement,
      rotate: '360deg',
      easing: 'easeInOutSine',
      duration: 1000,
    });

  }

  saveNewAlias(inputValue: string): void {
    if (inputValue === '' || inputValue.length > 9) {
      console.log('Invalid feedback: Please choose a username');
      return;
    }
    localStorage.setItem('imageUrl', this.newImageUrl)
    this.userService.setUsername(inputValue)

    this.imageUrl = this.newImageUrl
    this.username = this.newUsername

    this.usernameChange.emit()
    this.imageUrlChange.emit()

    this.displayStyle = 'none'

    console.log("TAB: ", localStorage.getItem('imageUrl'))

  }

}
