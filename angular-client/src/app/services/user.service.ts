import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private username = new BehaviorSubject('')
  private imageUrl = new BehaviorSubject('')
  private joining  = new BehaviorSubject(false)

  getUsername = this.username.asObservable()
  getImageUrl = this.imageUrl.asObservable()
  getJoining  = this.joining.asObservable()

  constructor(private http: HttpClient) { }

  setUsername(username: string) {
    this.username.next(username)
  }

  setImageUrl(imageUrl: string) {
    this.imageUrl.next(imageUrl)
  }

  setJoining(joining: boolean){
    this.joining.next(joining)
  }

  hostGame(gameChoice: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/host`,{ gameChoice: gameChoice}, options)
  }

  joinGame(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/join`, { gameId: gameId }, options)
  }

  leaveGame(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/leave`, { gameId: gameId }, options)
  }

  closeLobby(gameId: string): Observable<any> {
    const options = { withCredentials: true, body: { gameId: gameId, } }
    return this.http.delete(`${environment.apiUrl}/api/game/close`, options)
  }

  getGameData(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.get(`${environment.apiUrl}/api/game/gameData?gameId=${gameId}`, options);
  }

}