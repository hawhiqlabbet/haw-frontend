import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private username = new BehaviorSubject('')
  private imageUrl = new BehaviorSubject('')

  getUsername = this.username.asObservable()
  getImageUrl = this.imageUrl.asObservable()

  constructor() { }

  setUsername(username: string) {
    this.username.next(username)
  }

  setImageUrl(imageUrl: string) {
    this.imageUrl.next(imageUrl)
  }

}