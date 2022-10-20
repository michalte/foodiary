import {Component, OnDestroy, OnInit} from '@angular/core';
import {DishService} from "../services/dish.service";
import {createOutput} from "@angular/compiler/src/core";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {

  menuOpened = false;
  displayedColumns: string[] = ['statName', 'statWinner', 'statValue'];
  dateRange = {start: null, end: null};
  userDishes = [];
  unfilteredUserDishes = [];
  subscriptions: Subscription[] = [];
  showHint = true;
  exchangeRates = new Map();
  averagePrices = [];
  pricesIndex = 0;
  totalPrices = [];

  dataSource: any[];


  constructor(private dishService: DishService, private snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
        this.subscriptions.forEach(o => o.unsubscribe());
    }

  ngOnInit(): void {
    this.subscriptions.push(this.dishService.userDishesSubject.subscribe(dishes => {
      this.userDishes = dishes;
      this.unfilteredUserDishes = this.userDishes.slice();
    }));
    this.setExchangeRatesValues();
  }

  openCloseNav() {
    this.menuOpened ? this.menuOpened = false : this.menuOpened = true;
  }

  resetDateRangePicker(){
    this.dateRange.start = null;
    this.dateRange.end = null;
  }

  filterValuesByDate(){
    if(this.showHint) this.showHint = false;
    this.userDishes = this.unfilteredUserDishes;
    this.userDishes = this.userDishes.filter(o => Date.parse(o.date) >= Date.parse(this.dateRange.start) && Date.parse(o.date) <= Date.parse(this.dateRange.end.toDateString()));
    if(this.userDishes.length==0){
      this.snackBar.open('No dishes in this period.', 'OK', {
        duration: 4000
      });
      return;
    }
    this.createStats();
  }

  createStats(){
    this.totalPrices = [];
    const stats = [];
    let placeCountFlag = 0;
    let placeFlag = new Set();
    let numberOfDeliveries = 0;
    let numberOfDineIns = 0;
    let cityCountFlag = 0;
    let cityFlag = new Set();

    for(let i=0; i<this.userDishes.length; i++){
      let place = this.userDishes[i].place+" ("+this.userDishes[i].city+")";
      let city = this.userDishes[i].city;
      let placeCount = 0;
      let cityCount = 0;
      this.userDishes[i].delivery? numberOfDeliveries++ : numberOfDineIns++;
      for(let j=0; j<this.userDishes.length; j++){
        if(this.userDishes[j].place+" ("+this.userDishes[j].city+")" == place) placeCount++;
        if(this.userDishes[j].city == city) cityCount++;
      }
      if(placeCount>=placeCountFlag){
        if(placeCount>placeCountFlag) placeFlag.clear();
        placeFlag.add(place);
        placeCountFlag = placeCount;
      }
      if(cityCount>=cityCountFlag){
        if(cityCount>cityCountFlag) cityFlag.clear();
        cityFlag.add(city);
        cityCountFlag = cityCount;
      }
    }
    let placeString = '';
    placeFlag.forEach(o => placeString = placeString+o+", ");
    placeString = placeString.substring(0, placeString.length - 2);

    let cityString = '';
    cityFlag.forEach(o => cityString = cityString+o+", ");
    cityString = cityString.substring(0, cityString.length - 2);

    let tagResult = this.createTagStat();
    let tagString = '';
    tagResult.tagFlag.forEach(o => tagString = tagString+o+", ")
    tagString = tagString.substring(0, tagString.length - 2);

    let rateResult = this.createHighestRateDishStat();
    let rateString = '';
    rateResult.dishFlag.forEach(o => rateString = rateString+o+", ")
    rateString = rateString.substring(0, rateString.length - 2);

    let averageRate = this.createAverageRateStat();
    averageRate = Math.round((averageRate + Number.EPSILON) * 100) / 100;

    this.averagePrices = this.createAveragePriceStat();

    let currencyResult = this.createFavouriteCurrencyStat();
    let currencyString = ''
    currencyResult.currencyFlag.forEach(o => currencyString = currencyString+o+", ");
    currencyString = currencyString.substring(0, currencyString.length - 2);


    stats.push({statName: 'Most visited place', statWinner: placeString, statValue: placeCountFlag.toString()+"×"});
    stats.push({statName: 'Most visited city', statWinner: cityString, statValue: cityCountFlag.toString()+"×"});
    stats.push({statName: "Most common tag", statWinner: tagString, statValue: tagResult.tagCountFlag.toString()+"×"});
    stats.push({statName: "Best rated dish", statWinner: rateString, statValue: rateResult.rateFlag.toString()+"★"});
    stats.push({statName: 'Average dish rate', statWinner: '-', statValue: averageRate.toString()+"★"});
    stats.push({statName: 'Food deliveries', statWinner: '-', statValue: numberOfDeliveries.toString()+"×"});
    stats.push({statName: "Meals on the premises", statWinner: '-', statValue: numberOfDineIns.toString()+"×"});
    stats.push({statName: "Average dish price", statWinner: '-', statValue: "ᐊ  "+this.averagePrices[this.pricesIndex].toString()+"  ᐅ"});
    stats.push({statName: "Total money spent", statWinner: '-', statValue: "ᐊ  "+((this.totalPrices[this.pricesIndex])).toString()+"  ᐅ"});
    stats.push({statName: "Most used currency", statWinner: currencyString, statValue: currencyResult.countFlag.toString()+"×"});


    this.dataSource = stats;


  }

  createTagStat(){
    let tagFlag = new Set();
    let tagCountFlag = 0;
    for(let i=0; i<this.userDishes.length; i++){
      for(let j=0; j<this.userDishes[i].tags.length; j++){
        let tag = this.userDishes[i].tags[j];
        let tagCount = 0;
        for(let k=0; k<this.userDishes.length; k++){
            if(this.userDishes[k].tags.includes(tag)) tagCount++;
        }
        if(tagCount>=tagCountFlag){
          if(tagCount>tagCountFlag) tagFlag.clear();
          tagFlag.add(tag);
          tagCountFlag = tagCount;
        }
      }
    }
    return {tagFlag: tagFlag, tagCountFlag: tagCountFlag};
  }

  createHighestRateDishStat(){
    let dishFlag = new Set();
    let rateFlag = 0;
    for(let i=0; i<this.userDishes.length; i++){
      let rate = Number.parseInt(this.userDishes[i].rate);
        if(rate>=rateFlag){
          if(rate>rateFlag) dishFlag.clear();
          dishFlag.add(this.userDishes[i].dishName +" ["+this.userDishes[i].place+" ("+this.userDishes[i].city+")]");
          rateFlag = rate;
        }
    }
    return {dishFlag: dishFlag, rateFlag: rateFlag}
  }

  createAverageRateStat(){
    let sum = 0;
    this.userDishes.forEach(o => sum += o.rate);
    console.log(sum);
    return sum/this.userDishes.length;
  }

  createAveragePriceStat(){
    let sum = 0;
    let count = 0;
    const prices = [];
    this.userDishes.forEach(o => {
      if (o.price){
        sum += (o.price * this.exchangeRates.get(o.currency));
        count++;
      }
    });
    let plnSum;
    if(count!=0) plnSum = sum/count;
    else plnSum = 0;
    this.exchangeRates.forEach((value, key) => {
      let averagePrice;
      let totalPrice;
      averagePrice = plnSum/value;
      averagePrice = Math.round((averagePrice + Number.EPSILON) * 100) / 100;
      totalPrice = averagePrice*count;
      this.totalPrices.push(totalPrice + " "+key);
      averagePrice = averagePrice + " "+key;
      prices.push(averagePrice);
    })
    return prices;
  }

  setExchangeRatesValues(){
    this.exchangeRates.set('PLN', 1);
    this.exchangeRates.set('EUR', 4.71);
    this.exchangeRates.set('GBP', 5.52);
    this.exchangeRates.set('USD', 4.47);
    this.exchangeRates.set('JPY', 0.034);
  }

  changeCurrency(row){
    if(row.statName == 'Average dish price'){
      this.pricesIndex = (this.pricesIndex+1)%5;
      this.createStats();
    }
  }

  createFavouriteCurrencyStat(){
    let currencyFlag = new Set();
    let currency = '';
    let countFlag = 0;
    for(let i=0; i<this.userDishes.length; i++){
      let count = 0;
      if(this.userDishes[i].price!=0){
        currency = this.userDishes[i].currency;
        for(let j=0; j<this.userDishes.length; j++){
          if(currency == this.userDishes[j].currency) count++;
        }
        if(count>=countFlag){
          if(count>countFlag) currencyFlag.clear();
          currencyFlag.add(currency);
          countFlag = count;
        }
      }
    }
    return {currencyFlag: currencyFlag, countFlag: countFlag};
  }

  }
