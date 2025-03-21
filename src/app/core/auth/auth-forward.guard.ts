import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthForwardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){
    
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if(this.authService.getIsLoggedIn()){
      this.router.navigate(['/'])
      return false;
    }
    return true;
  }
};

