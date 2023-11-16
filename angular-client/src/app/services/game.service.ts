import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket: any;

  constructor(private http: HttpClient) { }

  hostGame(): Observable<any> {
    const options = { withCredentials: true }
    return this.http.get(`${environment.apiUrl}/api/game/host`, options)
  }

  hostGameSocketConnect(gameId: string, username: string, gameChoice: string): void {
    if (!this.socket) {
      this.socket = io(environment.apiUrl)
    }
    this.socket.emit('hostGame', { gameId, username, gameChoice })
  }

  joinGame(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/join`, { gameId: gameId }, options)
  }

  joinGameSocketConnect(gameId: string, username: string) {
    if (!this.socket) {
      this.socket = io(environment.apiUrl)
    }
    this.socket.emit('joinGame', { gameId, username })
  }

}
