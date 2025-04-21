import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResponseType } from '../../../../types/user-response.type';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './adaptive-header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  userName: string | null = null;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
    if(this.isLogged){
      this.updateUserName();

    }

  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      if(isLoggedIn){
        this.updateUserName();
        
      }
    });

  }

  updateUserName(): void {
    this.authService.getUserInfo().subscribe({
      next: (data: DefaultResponseType | UserResponseType) => {
        let error = null
        if ((data as DefaultResponseType).error !== undefined) {
          error = (data as DefaultResponseType).message
        }
        const userResponse = data as UserResponseType;
        if (!userResponse.id || !userResponse.name || !userResponse.email) {
          error = "Не удалось получить данные о пользователе!"
        }
        if (error) {
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.userName = userResponse.name;
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message)
        } else {
          this._snackBar.open("Не удалось получить данные о пользователе!")
        }
      }
    })
  }


  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      }
    })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null; 
    this._snackBar.open('Вы вышли из системы!');
    this.router.navigate(['/']);
  }
}
