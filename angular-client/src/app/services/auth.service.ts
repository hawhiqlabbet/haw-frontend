import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {
  }

  register(username: string, password: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post<any>(`${this.apiUrl}/api/auth/register`, { username, password }, options);
  }

  login(username: string, password: string): Observable<any> {
    const options = { withCredentials: true }
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, { username, password }, options);
  }


}
