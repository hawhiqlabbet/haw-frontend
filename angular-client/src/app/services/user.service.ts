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

  hostGame(gameChoice: string, username: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/host`,{ gameChoice: gameChoice, username: username }, options)
  }

  joinGame(gameId: string, username: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/join`, { gameId: gameId, username: username }, options)
  }

  leaveGame(gameId: string, username: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/leave`, { gameId: gameId, username: username }, options)
  }

  closeLobby(gameId: string, username: string): Observable<any> {
    const options = { withCredentials: true, body: { gameId: gameId, username: username } }
    return this.http.delete(`${environment.apiUrl}/api/game/close`, options)
  }

  getGameData(gameId: string, username: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.get(`${environment.apiUrl}/api/game/gameData?gameId=${gameId}&username=${username}`, options);
  }

  startGame(gameId: string, gameTimeInS: any, username: string): Observable<any> {
    const options = { withCredentials: true }
    console.log("LOOOK HERE ", username)
    return this.http.post(`${environment.apiUrl}/api/game/startGame?gameId=${gameId}`, { gameTimeInS: gameTimeInS, username: username }, options);
  }

  spyQVote(gameId: string, username: string, votedFor: string) {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/spyQVote?gameId=${gameId}`, { username: username, votedFor: votedFor }, options)
  }

}