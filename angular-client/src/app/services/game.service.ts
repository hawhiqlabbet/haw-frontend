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

  constructor(private router: Router) { 
    this.socket = io(environment.apiUrl) 
  }

  hostGameSocketConnect(gameId: string, username: string, gameChoice: string): void {
    if (!this.socket) {
      this.socket = io(environment.apiUrl)
    }
    this.socket.connect()
    const data ={
      gameId: gameId,
      username: username,
      gameChoice: gameChoice
    }
    this.socket.emit('hostGame', data)
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
    })

  }

  closeLobbySocket(gameId: string, username: string) {
    this.socket.emit('closeLobby', { gameId, username })
    this.socket.disconnect()
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
        if(localStorage.getItem('username') !== username) {
          console.log(`User ${username} joined the game! With profile picture: ${imageUrl} and the players are ${players}`);
        }
        observer.next({ username, imageUrl });
      });
    });
  }

  playerLeftEvent(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('playerLeft', (data: any) => {
        const { username } = data
        if(localStorage.getItem('username') !== username)
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
