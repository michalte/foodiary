import {Component, Input, OnInit} from '@angular/core';
import {AppUser} from "../models/AppUser";
import {NgForm, NgModel} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {MyCustomizedHttpResponse} from "../models/MyCustomizedHttpResponse";


@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {

  hidePassword: boolean = true;
  hideRepeatedPassword: boolean = true;
  termsAccepted: boolean = false;
  repeatedPasswordCheck: string = "";
  serverError = "";

  newUser: AppUser = new AppUser();

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
  }


  submit(){
    this.authenticationService.register(this.newUser).subscribe(response => {
      console.log(response)
      this.router.navigate(['login-page']).then(r => console.log("Redirected to Login Page"))
    }, error => {
        console.log(error.error.developerMessage)
        this.serverError = error.error.developerMessage + "! You have not been registered."
    });
  }
  makeSureCapitalLetterFirst(){
    if(this.newUser.name.length === 1) this.newUser.name = this.newUser.name.toUpperCase();
  }

  show(login: NgModel,input: HTMLInputElement){
    console.log(login);
    console.log(input.value);
  }
}
