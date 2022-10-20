import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {AppUser} from "../models/AppUser";
import {HttpResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PasswordreminderComponent} from "../passwordreminder/passwordreminder.component";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  login: string = "";
  password: string = "";
  subscriptions: Subscription[] = [];
  error = "";

  constructor(private authenticationService: AuthenticationService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  logInTheUser(): void{

    const userToLogIn: AppUser = new AppUser();
    userToLogIn.login = this.login;
    userToLogIn.password = this.password;

    this.subscriptions.push(
      this.authenticationService.login(userToLogIn).subscribe((response: HttpResponse<AppUser>) => {
        const token = response.headers.get('Jwt-Token');
        this.authenticationService.saveJwt(token);
        this.authenticationService.putAppUserInLocalStorage(response.body);
        this.router.navigate(['food-list-page'])
      }, error => {
        console.log(error);
        this.error = "Provided credentials are incorrect."
      }
    ));
  }

ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
}

  openDialog(){
    const dialogRef = this.dialog.open(PasswordreminderComponent, {
      data: {},
      hasBackdrop: true
    })
  }
}
