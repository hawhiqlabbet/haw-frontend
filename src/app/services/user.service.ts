import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment as environment } from 'src/environments/environment'

interface WindowWithEnv extends Window {
  env?: {
    API_ENDPOINT?: string;
    // Add other properties as needed
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrlFromEnv = (window as WindowWithEnv).env?.API_ENDPOINT;
  private apiUrl: string = this.apiUrlFromEnv ?? environment.apiUrl; // Set the API endpoint dynamically

  constructor(private http: HttpClient) { }

  setUsername(username: string): void {
    localStorage.setItem('username', username)
  }

  generateImageUrl(): string {
    const randomString = [...Array(9)].map(() => Math.random().toString(36)[2]).join('');
    return `https://api.multiavatar.com/${randomString}.png`
  }

  setImageUrl(): void {
    const randomUrl = this.generateImageUrl();
    localStorage.setItem('imageUrl', randomUrl);
  }

  setIsHost(isHost: boolean): void {
    localStorage.setItem('isHost', `${isHost}`)
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getImageUrl() {
    return localStorage.getItem('imageUrl');
  }

  getIsHost(): boolean {
    return localStorage.getItem('isHost') === 'true'
  }

  removeUsername() {
    localStorage.removeItem('username')
  }

  removeImageUrl() {
    localStorage.removeItem('imageUrl')
  }

  removeIsHost() {
    localStorage.removeItem('isHost')
  }

  hostGame(gameChoice: string, username: string, imageUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/game/host`, { gameChoice: gameChoice, username: username, imageUrl: imageUrl })
  }

  joinGame(gameId: string, username: string, imageUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/game/join`, { gameId: gameId, username: username, imageUrl: imageUrl })
  }

  leaveGame(gameId: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/game/leave`, { gameId: gameId, username: username })
  }

  newRound(gameId: string, username: string): Observable<any> {
    const options = { body: { gameId: gameId, username: username } }
    return this.http.delete(`${this.apiUrl}/api/game/newRound`, options)
  }

  closeLobby(gameId: string, username: string): Observable<any> {
    const options = { body: { gameId: gameId, username: username } }
    return this.http.delete(`${this.apiUrl}/api/game/close`, options)
  }

  getGameData(gameId: string, username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/game/gameData?gameId=${gameId}&username=${username}`);
  }

  startGame(gameId: string, gameTimeInMS: number, username: string, category: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/game/startGame?gameId=${gameId}`, { gameTimeInMS: gameTimeInMS, username: username, category: category });
  }

  spyQVote(gameId: string, username: string, votedFor: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/game/spyQVote?gameId=${gameId}`, { username: username, votedFor: votedFor })
  }

  hiQlashAnswer(gameId: string, username: string, answer1: string, answer2: string) {
    return this.http.post(`${this.apiUrl}/api/game/hiQlashAnswer?gameId=${gameId}`, { username: username, promptAnswer1: answer1, promptAnswer2: answer2 })
  }

  hiQlashVote(gameId: string, username: string, votedFor: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/game/hiQlashVote?gameId=${gameId}`, { username: username, votedFor: votedFor })
  }

}