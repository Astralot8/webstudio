import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { DefaultResponseType } from '../../../types/default-response.type';
import { LoginResponseType } from '../../../types/login-response.type';
import { environment } from '../../../environments/environment';
import { UserResponseType } from '../../../types/user-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>;
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }


  getUserInfo(): Observable<DefaultResponseType | UserResponseType> {
    return this.http.get<DefaultResponseType | UserResponseType>(environment.api + 'users')
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    })
  }

  signup(name: string, email: string, password: string,): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    });
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Can not find token');
  }

  public getIsLoggedIn(): boolean {
    return this.isLogged;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }
  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }
  getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Can not find token');
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }
  
}
