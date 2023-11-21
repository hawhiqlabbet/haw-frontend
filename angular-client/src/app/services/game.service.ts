import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { io } from 'socket.io-client'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket: any

  constructor(private http: HttpClient, private router: Router) { 
    this.socket = io(environment.apiUrl) 
  }

  /*
  hostGameSocketConnect(gameId: string, username: string, gameChoice: string): void {
    if (!this.socket) {
      this.socket = io(environment.apiUrl)
    }
    this.socket.connect()
    this.socket.emit('hostGame', { gameChoice })
  }
  */

  getGameData(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.get(`${environment.apiUrl}/api/game/gameData?gameId=${gameId}`, options);
  }

  joinGameSocketConnect(gameId: string, username: string, imageUrl: string) {
    if (!this.socket) {
      this.socket = io(environment.apiUrl)
    }
    this.socket.connect()
    const data = {
      gameId: gameId,
      username: username,
      imageUrl: imageUrl,
    }
    this.socket.emit('joinGame', data)

    this.socket.on('userList', (data: any) => {
      console.log('List of users:', data.players);
    })

  }

  closeLobby(gameId: string): Observable<any> {
    const options = {
      withCredentials: true,
      body: {
        gameId: gameId,
      }
    }
    return this.http.delete(`${environment.apiUrl}/api/game/close`, options)
  }

  leaveGame(gameId: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post(`${environment.apiUrl}/api/game/leave`, { gameId: gameId }, options)
  }

  closeLobbySocket(gameId: string, username: string) {
    this.socket.emit('closeLobby', { gameId, username })
  }

  leaveGameSocket(gameId: string, username: string) {
    this.socket.emit('leaveGame', { gameId, username })
    this.socket.disconnect()
  }

  startGameSocket(gameId: string, username: string){
    this.socket.emit('startGame', { gameId, username })
  }

  disconnectBeforeUnload(username: string) {
    this.socket.emit('disconnectWithUsername', { username });
    //this.socket.disconnect();
  }

  lobbyClosedEvent() {
    this.socket.on('lobbyClosed', (data: any) => {
      const { gameId, username } = data
      console.log(`Host ${username} closed the lobby, disconnecting...`)
      this.socket.disconnect()
      this.router.navigateByUrl('/home')
    })
  }

  playerJoinedEvent(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('playerJoined', (data: any) => {
        const { username, imageUrl, players } = data;
        console.log(`User ${username} joined the game! With profile picture: ${imageUrl} and the players are ${players}`);
        observer.next({ username, imageUrl });
      });
    });
  }

  playerLeftEvent(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('playerLeft', (data: any) => {
        const { username } = data
        console.log(`User ${username} left the game!`)
        observer.next({ username })
      });
    });

  }

  hostStartedEvent(){
    this.socket.on('hostStarted', (data: any) => {
      const { username, gameChoice } = data
      console.log(`Host ${username} started the game with mode ${gameChoice}`)
    })
  }
}
