import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";
import {Dish} from "../models/Dish";

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private backendUrl = environment.backendUrl;

  userDishesSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.userDishesSubject = new BehaviorSubject<any>([]);
    this.getUserDishes();
  }

  deleteUserDish(id){
    this.http.delete(`${this.backendUrl}/dish/deleteDish/${id}`).subscribe(response => {
      this.userDishesSubject.next(response);
    })
  }

  addUserDish(dish){
    this.http.post(`${this.backendUrl}/dish/addDish`, dish).subscribe(response => {
      this.userDishesSubject.next(response);
    })
  }

  getUserDishes(){
    const username = JSON.parse(localStorage.getItem('appUser')).login.toString();

    this.http.get(`${this.backendUrl}/dish/getDishes`, {
      params: {
        username: username
      }
    }).subscribe(response => {
      this.userDishesSubject.next(response);
    })
  }
}
