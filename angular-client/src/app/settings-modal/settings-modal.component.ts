import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

interface DropdownItem {
  name: string;
  label: string;
}

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent {
  @ViewChild('modal') modalElement: ElementRef | undefined;
  @ViewChild('aliasForm') aliasForm: NgForm | undefined;

  @Input() category: string = ''
  @Input() timeDifference: number = 0
  @Input() gameChoice: string = ''

  @Output() openModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() formSubmitted: EventEmitter<{ selectedCategory: string, selectedTime: number }> = new EventEmitter<{
    selectedCategory: string,
    selectedTime: number
  }>();


  selectedTime: number = 0
  selectedCategory: string = ''

  dropdownItems: DropdownItem[] = []

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    console.log(this.gameChoice)
    this.selectedTime = this.timeDifference / 1000
    

    if(this.gameChoice === "SpyQ") {
      this.selectedCategory = "countries"
      this.dropdownItems = [
        { name: 'countries', label: 'Länder' },
        { name: 'HiQAreas', label: 'Platser på HiQ' },
        { name: 'itTitles', label: 'Arbetsroller' },
        { name: 'programmingLanguages', label: 'Programmeringsspråk' }
      ];
    }
    else if(this.gameChoice === "HiQlash") {
      this.selectedCategory = "default"
      this.dropdownItems = [
        { name: 'HiQ', label: 'HiQ'},
        { name: 'default', label: 'vanliga'}
      ]
    }
    else {
      console.log("Error, wierd gameChoice")
    }
    console.log(this.getSelectedLabel())
  }

  displayStyle = "none"

  openPopup(): void {
    this.displayStyle = "block"
  }

  closePopup(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const modalContent = this.modalElement?.nativeElement.querySelector('.modal-content');
    const isCloseButton = clickedElement.classList.contains('btn-close');

    if (!modalContent || isCloseButton || !modalContent.contains(clickedElement)) {
      this.displayStyle = 'none';
    }
  }

  openModalExternally(): void {
    this.openPopup();
  }

  onFormSubmit(): void {
    const formData = {
      selectedCategory: this.selectedCategory,
      selectedTime: this.selectedTime * 1000
    };
    this.formSubmitted.emit(formData);
    this.displayStyle = 'none';
  }

  selectOption(option: string): void {
    this.selectedCategory = option;
  }

  getSelectedLabel(): string {
    const selectedItem = this.dropdownItems.find(item => item.name === this.selectedCategory);
    return selectedItem ? selectedItem.label : '';
  }

}
