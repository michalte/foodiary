import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-passwordreminder',
  templateUrl: './passwordreminder.component.html',
  styleUrls: ['./passwordreminder.component.scss']
})
export class PasswordreminderComponent implements OnInit {

  message = '';

  form = this.fb.group({
    login: this.fb.control('', Validators.required),
    email: this.fb.control('', Validators.required),
    name: this.fb.control('', Validators.required),
  })

  constructor(private dialogRef: MatDialogRef<PasswordreminderComponent>, private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
  }

  resetPassword(formDirective){
    this.userService.resetPassword(this.form.get('login').value,this.form.get('email').value, this.form.get('name').value);
    formDirective.resetForm();
    this.form.reset();
    this.message = "If provided information is valid, you should receive an e-mail with your new password."
  }
}
