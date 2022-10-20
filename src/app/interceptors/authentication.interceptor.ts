import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(request.url.includes('http://localhost:8080/user/login')){
      return next.handle(request);
    }
    if(request.url.includes('http://localhost:8080/user/register')){
      return next.handle(request);
    }
    if(request.url.includes('http://localhost:8080/user/resetUserPassword')){
      return next.handle(request);
    }
    this.authenticationService.loadJwt();
    const jwt = this.authenticationService.getJwt();

    const requestWithJwt = request.clone({setHeaders: {
    Authorization: `Bearer ${jwt}`
      }});

    return next.handle(requestWithJwt);
  }
}
