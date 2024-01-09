import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { io } from 'socket.io-client'
import { Router } from '@angular/router'

interface WindowWithEnv extends Window {
  env?: {
    API_ENDPOINT?: string;
    // Add other properties as needed
  };
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket: any

  private apiUrlFromEnv = (window as WindowWithEnv).env?.API_ENDPOINT;
  private apiUrl: string = this.apiUrlFromEnv ?? environment.webSocketUrl; // Set the API endpoint dynamically

  constructor(private router: Router) {
    this.socket = io(this.apiUrl)
  }

  hostGameSocketConnect(gameId: string, username: string, gameChoice: string): void {
    if (!this.socket) {
      this.socket = io(this.apiUrl)
    }
    this.socket.connect()
    console.log('hostGameSocketConnect', username)

    const data = {
      gameId: gameId,
      username: username,
      gameChoice: gameChoice
    }
    this.socket.emit('hostGame', data)
  }


  joinGameSocketConnect(gameId: string, username: string, imageUrl: string) {

    console.log('joinGameSocketConnect', username)
    if (!this.socket) {
      this.socket = io(this.apiUrl)
      //this.socket = io(this.apiUrl)
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

  newRoundSocket(gameId: string, username: string) {
    this.socket.emit('newRound', { gameId, username })
  }

  closeLobbySocket(gameId: string, username: string) {
    this.socket.emit('closeLobby', { gameId, username })
    this.socket.disconnect()
  }

  leaveGameSocket(gameId: string, username: string) {
    this.socket.emit('leaveGame', { gameId, username })
    this.socket.disconnect()
  }

  startGameSocket(gameId: string, username: string) {
    this.socket.emit('startGame', { gameId, username })
  }

  disconnectBeforeUnload(username: string) {
    this.socket.emit('disconnectWithUsername', { username });
    //this.socket.disconnect();
  }

  reportSpyQVotingDone(gameId: string) {
    this.socket.emit('reportVotingDone', { gameId })
  }

  reportHiQlashAnswersDone(gameId: string) {
    this.socket.emit('reportHiQlashAnswersDone', {gameId})
  }
  reportHiQlashVotingDone(gameId: string) {
    console.log("report hiqlash vote done")
    this.socket.emit('reportHiQlashVotingDone', {gameId})
  }

  newRoundEvent(): Observable<any> {
    return new Observable((observer) => {

      this.socket.on('newRound', (data: any) => {
        const { username } = data
        console.log(`Host ${username} is starting a new round!`)
        observer.next()

      })
    })
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
        if (localStorage.getItem('username') !== username) {
          console.log(`User ${username} joined the game! With profile picture: ${imageUrl} and the players are:`);

        }
        observer.next({ username, imageUrl });
      });
    });
  }

  playerLeftEvent(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('playerLeft', (data: any) => {
        const { username } = data
        if (localStorage.getItem('username') !== username)
          console.log(`User ${username} left the game!`)
        observer.next({ username })
      });
    });

  }

  hostStartedEvent() {
    return new Observable((observer) => {
      this.socket.on('hostStarted', (data: any) => {
        const { username, gameChoice, gameData } = data
        observer.next({ username, gameChoice, gameData });
      })
    });
  }

  votingDoneEvent() {
    return new Observable((observer) => {
      this.socket.on('votingDone', (data: any) => {
        const { votingData, foundSpy, spyName } = data
        observer.next({ votingData, foundSpy, spyName })
      })
    })
  }

  hiQlashAnswersDoneEvent() {
    return new Observable((observer) => {
      this.socket.on('hiQlashAnswersDone', (data: any) => {
        const{ gameId } = data
        observer.next({ gameId })
      })
    })
  }

  hiQlashVotingDoneEvent() {
    return new Observable((observer) => {
      this.socket.on('hiQlashVotingDone', (data: any) => {
        console.log(data)
        const { votingData } = data
        observer.next({ votingData })
      })
    })
  }

  hiQlashPromptUpdateEvent() {
    return new Observable((observer) => {
      this.socket.on('hiQlashPromptUpdate', (data: any) => {
        const{ prompt, players, promptAnswers } = data
        observer.next({ prompt, players, promptAnswers })
      })
    })
  }

  hiQlashEndEvent() {
    return new Observable((observer) => {
      this.socket.on('hiQlashEnd', (data: any) => {
        const{ playerScores } = data
        observer.next({ playerScores })
      })
    })
  }

  timerUpdateEvent() {
    return new Observable((observer) => {
      this.socket.on('timeUpdateEvent', (data: any) => {
        const { endTime, endVoteTime } = data
        observer.next({ endTime, endVoteTime })
      })
    })
  }

  disconnectSocket() {
    this.socket.disconnect()
  }

  connectSocket() {
    return new Observable((observer) => {
      this.socket.on('connect', () => {
        console.log("Connecting!")
        observer.next()
      })
    })
  }
}