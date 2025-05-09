import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginResponseType } from '../../../../types/login-response.type';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './adaptive-login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  showPass: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    })
  }

  ngOnInit(): void {

  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = "Не удалось войти в систему!"
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open("Вход выполнен!")
            this.router.navigate(['/'])
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open("Не удалось войти в систему!")
            }

          }
        })
    }
  }

  passToggle(): void {
    this.showPass = !this.showPass;
  }

}
