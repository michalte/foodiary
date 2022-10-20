import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {AppUser} from "../models/AppUser";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) {

  }

  public updateUserPassword(oldPassword, newPassword){
    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    formData.forEach(o => console.log(o));

    return this.http.post(`${this.backendUrl}/user/updateUserPassword`, formData);
  }

  public getAppUsers(): Observable<AppUser[] | HttpErrorResponse> {
    return this.http.get<AppUser[]>(`${this.backendUrl}/user/list`);
  }


  public updateAppUser(form: FormData): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.backendUrl}/user/update`, form);
  }

  buildAppUserFormDataTemplate(currentUserLogin: string, appUser: AppUser): FormData{
    const formData = new FormData();
    formData.append('currentUserLogin', currentUserLogin);
    formData.append('login', appUser.login);
    formData.append('password', appUser.password);
    formData.append('email', appUser.email);
    formData.append('gender', appUser.gender);
    formData.append('role', appUser.role);
    formData.append('isUnbanned', JSON.stringify(appUser.isUnbanned));
    formData.append('isActive', JSON.stringify(appUser.isActive));
    return formData;
  }

  public resetPassword(login, email, name){
    const formData = new FormData();
    formData.append('login', login);
    formData.append('email', email);
    formData.append('name', name);
    this.http.post(`${this.backendUrl}/user/resetUserPassword`, formData).subscribe(r => console.log("RESET POSZEDL"));
  }

}
