import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { LoginResponseType } from '../../../../types/login-response.type';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  showPass: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, public _snackBar: MatSnackBar, private router: Router) {

    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[А-Я][а-яА-Я]{2,20}$/)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
      agree: [false, [Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {

  }

  signup() {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password).subscribe({
        next: (data: DefaultResponseType | LoginResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = data as LoginResponseType;
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = "Ошибка авторизации!";
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;
          this._snackBar.open("Вы успешно зарегистрировались!");
          this.router.navigate(['/']);
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open("Ошибка регистрации!");
          }
        },
      })
    }
  }
  passToggle(): void {
    this.showPass = !this.showPass;
  }

}
