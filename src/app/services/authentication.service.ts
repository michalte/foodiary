import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AppUser} from "../models/AppUser";
import {Observable} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private backendUrl: string = environment.backendUrl;
  private jwt: string | null;
  private loggedInUserLogin: string | null;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {

  }

  public login(appUser: AppUser): Observable<HttpResponse<AppUser> | HttpErrorResponse>{
    return this.http.post<AppUser>(`${this.backendUrl}/user/login`, appUser, {observe: 'response'})
  }

  public register(appUser: AppUser): Observable<AppUser | HttpErrorResponse> {
    console.log("BEFORE REGISTER");
    return this.http.post<AppUser | HttpErrorResponse>(`${this.backendUrl}/user/register`, appUser);
  }

  public saveJwt(jwt: string): void {
    this.jwt = jwt;
    localStorage.setItem('jwt',jwt);
  }

  public logout(): void {
  this.jwt = null;
  this.loggedInUserLogin = null;
  localStorage.removeItem('appUser');
  localStorage.removeItem('jwt');
  localStorage.removeItem('users');
  this.router.navigate(['login-page']);
  }

  public putAppUserInLocalStorage(appUser: AppUser): void {
    localStorage.setItem('appUser', JSON.stringify(appUser));
  }


  public loadJwt(): void {
    this.jwt = localStorage.getItem('jwt');
  }

  public getJwt(): string | null {
    return this.jwt;
  }

  public isLoggedIn(): boolean {
    this.loadJwt();
    if (this.jwt != null && this.jwt !== ''){
      if (this.jwtHelper.decodeToken(this.jwt).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.jwt)) {
          this.loggedInUserLogin = this.jwtHelper.decodeToken(this.jwt).sub;
          return true;
        }
      }
    } else {
      this.logout();
      return false;
    }
    return false;
  }

}
