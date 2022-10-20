import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegistrationPageComponent} from "./registration-page/registration-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {FoodListComponent} from "./food-list/food-list.component";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {AddItemComponent} from "./add-item/add-item.component";
import {StatsComponent} from "./stats/stats.component";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'registration-page', component: RegistrationPageComponent},
  {path: 'food-list-page', component: FoodListComponent, canActivate: [AuthenticationGuard]},
  {path: 'add-item-page', component: AddItemComponent, canActivate: [AuthenticationGuard]},
  {path: 'stats-page', component: StatsComponent, canActivate: [AuthenticationGuard]},
  {path: 'settings-page', component: SettingsComponent, canActivate: [AuthenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
