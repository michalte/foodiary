import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatDialog} from "@angular/material/dialog";
import {AddItemComponent} from "../add-item/add-item.component";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {DishService} from "../services/dish.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Dish} from "../models/Dish";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeleteconfirmationComponent} from "../deleteconfirmation/deleteconfirmation.component";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.4s ease-out',
              style({ height: '*', opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: '*', opacity: 1 }),
            animate('0.4s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class FoodListComponent implements OnInit {

  menuOpened = false;
  openedIndex = undefined;
  places = [];
  unfilteredPlaces = [];
  dishes = [];
  unfilteredDishes = [];
  tags = [];
  unfilteredTags = [];
  filters = {placeFilter: '', dishFilter: '', tags: []}
  sortBy = 'Date';
  dateRange = {start: null, end: null};
  delivery = 'All';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chip = '';
  exchangeRates = new Map();

  listOfUsersOrders = [];

  unfilteredListOfUsersOrders = [];

  constructor(private dialog: MatDialog, private dishService: DishService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.dishService.userDishesSubject.subscribe(dishes => {
      this.listOfUsersOrders = dishes;
      this.dishes = [...new Set(this.listOfUsersOrders.map(o => o.dishName).filter(o => o!=''))];

      this.unfilteredListOfUsersOrders = this.listOfUsersOrders.slice();
      this.places = [...new Set(this.listOfUsersOrders.map(o => o.place + " ("+o.city+")").filter(o => o!=''))];
      this.unfilteredPlaces = this.places.slice();

      this.unfilteredDishes = this.dishes.slice();
      let toFlat = this.listOfUsersOrders.map(o => o.tags);
      // @ts-ignore
      this.tags = [...new Set(toFlat.flat().filter(o => o!=''))];
      this.unfilteredTags = this.tags.slice();

      this.setExchangeRatesValues();
      this.filterUserOrders();
    })

  }

  public getSanitizeUrl(url : string) {
    const longURL = "data:image/JPEG;base64," + url;
    return this.sanitizer.bypassSecurityTrustUrl(longURL);
  }

  openCloseNav() {
    this.menuOpened ? this.menuOpened = false : this.menuOpened = true;
  }

  openDetails(id: number){
    id == this.openedIndex ? this.openedIndex = undefined : this.openedIndex = id;

  }

  filterPlaces(placeFilterValue){
    console.log(placeFilterValue)
    this.places = this.unfilteredPlaces;
    this.places = this.places.filter(o => o.toLowerCase().includes(placeFilterValue.toLowerCase()));
  }
  filterDishes(dishFilterValue){
    this.dishes = this.unfilteredDishes;
    this.dishes = this.dishes.filter(o => o.toLowerCase().includes(dishFilterValue.toLowerCase()));
  }
  filterTags(tagFilterValue){
    this.tags = this.unfilteredTags;
    this.tags = this.tags.filter(o => o.toLowerCase().includes(tagFilterValue.toLowerCase()));
  }

  filterUserOrders(){
    this.listOfUsersOrders = this.unfilteredListOfUsersOrders;
    this.listOfUsersOrders = this.listOfUsersOrders.filter(o => (o.place.toLowerCase()+" ("+o.city.toLowerCase()+")").includes(this.filters.placeFilter.toLowerCase()));
    this.listOfUsersOrders = this.listOfUsersOrders.filter(o => o.dishName.toLowerCase().includes(this.filters.dishFilter.toLowerCase()));
    if(this.dateRange.start != undefined && this.dateRange.end != undefined){
      this.listOfUsersOrders = this.listOfUsersOrders.filter(o => Date.parse(o.date) >= Date.parse(this.dateRange.start) && Date.parse(o.date) <= Date.parse(this.dateRange.end.toDateString()));
    }
    if(this.delivery!='All') {
      this.listOfUsersOrders = this.listOfUsersOrders.filter(o => o.delivery == JSON.parse(String(this.delivery)));
    }

    if(this.filters.tags.length>0) {

      this.listOfUsersOrders = this.listOfUsersOrders.filter(order => this.filters.tags.every(v => order.tags.includes(v)));
    }

    this.sortUserOrders();
  }

  sortUserOrders() {
    if (this.sortBy == 'Rating') {
      // @ts-ignore
      this.listOfUsersOrders = this.listOfUsersOrders.sort((a, b) => {
        if (a.rate < b.rate) return 1;
        if (a.rate > b.rate) return -1;
        if (a.rate == b.rate) return 0;
      })
    }else if (this.sortBy == 'Price') {
      // @ts-ignore
      this.listOfUsersOrders = this.listOfUsersOrders.sort((a, b) => {
        if ((a.price * this.exchangeRates.get(a.currency)) < (b.price * this.exchangeRates.get(b.currency))) return 1;
        if ((a.price * this.exchangeRates.get(a.currency)) > (b.price * this.exchangeRates.get(b.currency))) return -1;
        if ((a.price * this.exchangeRates.get(a.currency) == b.price * this.exchangeRates.get(b.currency))) return 0;
      })
    }else{
      // @ts-ignore
      this.listOfUsersOrders = this.listOfUsersOrders.sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        if (a.date == b.date) return 0;
      })
    }
  }

  addTag(){
    if(this.filters.tags.length<3) this.filters.tags.push(this.chip);
  }

  deleteTag(i){
    this.filters.tags.splice(i,1);
    this.filterUserOrders();
  }

  resetDateRangePicker(){
    this.dateRange.start = null;
    this.dateRange.end = null;
    this.filterUserOrders();
  }

  openDialog(event, jpgURL){
    event.stopPropagation()
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: {jpg: jpgURL},
      hasBackdrop: true
    })
  }

  openDeleteConfirmation(event, id){
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteconfirmationComponent, {
      data: {id: id}
    })
  }

  setExchangeRatesValues(){
    this.exchangeRates.set('PLN', 1);
    this.exchangeRates.set('EUR', 4.71);
    this.exchangeRates.set('GBP', 5.52);
    this.exchangeRates.set('USD', 4.47);
    this.exchangeRates.set('JPY', 0.034);
  }

}
