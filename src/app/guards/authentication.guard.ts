import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {


  constructor(private router: Router, private authentication: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.hasUserTheAccess();
  }


  hasUserTheAccess(): boolean {

  if(this.authentication.isLoggedIn()){
    return true;
  }
    this.router.navigate(['/login-page']).then(r => console.log("Przeniesiono do strony logowania"));
    return false;
  }

}
