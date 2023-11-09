import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(public socket: Socket) {
    this.socket.connect();

  }

  // Method to emit the username to the server
  emitUsername(username: string): void {
    this.socket.emit('setClientUsername', username);
  }
}
