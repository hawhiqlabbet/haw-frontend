import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private apiUrl = environment.apiUrl

  constructor(public socket: Socket, private http: HttpClient) {
  }

  emitUsername(username: string): void {
    this.socket.connect();
    this.socket.emit('setClientUsername', username);
  }

  login(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { name: username });
  }
}
