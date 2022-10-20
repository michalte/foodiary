import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './login-page/login-page.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "./services/authentication.service";
import {UserService} from "./services/user.service";
import {AuthenticationInterceptor} from "./interceptors/authentication.interceptor";
import { FoodListComponent } from './food-list/food-list.component';
import { MenuComponent } from './menu/menu.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSelectModule} from "@angular/material/select";
import {MatChipsModule} from "@angular/material/chips";
import { AddItemComponent } from './add-item/add-item.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import {MatSliderModule} from "@angular/material/slider";
import {MatSnackBar} from "@angular/material/snack-bar";
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { StatsComponent } from './stats/stats.component';
import {MatTable, MatTableModule} from "@angular/material/table";
import { SettingsComponent } from './settings/settings.component';
import { PasswordreminderComponent } from './passwordreminder/passwordreminder.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    FoodListComponent,
    MenuComponent,
    AddItemComponent,
    ImageDialogComponent,
    DeleteconfirmationComponent,
    StatsComponent,
    SettingsComponent,
    PasswordreminderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatTableModule,
  ],
  providers: [AuthenticationService,
    UserService,
    MatSnackBar,
    MatTable,
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
