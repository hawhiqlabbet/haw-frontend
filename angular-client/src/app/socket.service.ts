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

  login(name: string): Observable<any> {
    console.log("post username")
    return this.http.post<any>(`${this.apiUrl}/login`, { username: name });
  }

  host(): Observable<any> {
    console.log("Hosting")
    return this.http.get<any>(`${this.apiUrl}/host`);
  }
}
