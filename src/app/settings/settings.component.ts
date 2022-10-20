import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {MyCustomizedHttpResponse} from "../models/MyCustomizedHttpResponse";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  menuOpened = false;
  hidePassword = true
  hideRepeatedPassword = true;
  message = '';
  success = false;
  src;

  form = this.fb.group({
    password: this.fb.control('', Validators.required),
    newPassword: this.fb.control('', Validators.required),
    repeatedPassword: this.fb.control('', Validators.required),
  })

  constructor(private fb: FormBuilder,
              private userService: UserService,
        //      private http: HttpClient,
          //    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  //  this.getImage()
  }

  openCloseNav() {
    this.menuOpened ? this.menuOpened = false : this.menuOpened = true;
  }

  updateUserPassword(){
    if(this.form.get('newPassword').value == this.form.get('repeatedPassword').value)
    this.userService.updateUserPassword(this.form.get('password').value, this.form.get('newPassword').value).subscribe((response: MyCustomizedHttpResponse) => {
      if(response.httpStatusCode == 400){
        this.message = response.developerMessage;
        this.success = false;
      }else{
        this.success = true;
        this.message = response.developerMessage;
      }
    });
    else this.message = "Passwords don't match";
  }

  // getImage(){
  //   this.http.get("http://localhost:8080/dish/getImage", {responseType: 'blob'}).subscribe(response => {
  //     this.src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
  //     console.log(this.src);
  //   })
  // }

}
