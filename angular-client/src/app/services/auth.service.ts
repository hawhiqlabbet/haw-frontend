import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface WindowWithEnv extends Window {
  env?: {
    API_ENDPOINT?: string;
    // Add other properties as needed
  };
}


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private apiUrlFromEnv = (window as WindowWithEnv).env?.API_ENDPOINT;
  private apiUrl: string = this.apiUrlFromEnv ?? environment.apiUrl; // Set the API endpoint dynamically

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
