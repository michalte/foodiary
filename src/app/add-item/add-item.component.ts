import {Component, Inject, OnInit} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DishService} from "../services/dish.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  menuOpened = false;
  userTags = [];
  tags = [];
  files: File[] = [];
  chip;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fileName;
  currencies = ['PLN', 'EUR', 'USD', 'GBP', 'JPY'];
  currencyRequired = false;

  form = this.fb.group({
    dishes: this.fb.array([]),
    date: this.fb.control('', Validators.required),
    place: this.fb.control('', Validators.required),
    city: this.fb.control('', Validators.required),
    country: this.fb.control(''),
    delivery: this.fb.control(false,),
    address: this.fb.control('')
  })


  constructor(private fb: FormBuilder, private dishService: DishService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.dishService.userDishesSubject.subscribe(dishes =>{
      let toFlat = dishes.map(o => o.tags);
      // @ts-ignore
      this.userTags = [...new Set(toFlat.flat().filter(o => o!=''))];
    })
    this.addDish();
  }

  openCloseNav() {
    this.menuOpened ? this.menuOpened = false : this.menuOpened = true;
  }

  format(value){
    return value + "★"
  }

  addTag(event, i){
    if(this.tags[i].length < 3) this.tags[i].push(event.option.viewValue);
  }
  addTagFromInput(event, i){
    if(this.tags[i].length < 3) this.tags[i].push(event.target.value);
  }

  deleteTag(i,id){
    this.tags[i].splice(id,1);
  }

  onFileSelected(event, i) {

    this.files[i] = event.target.files[0];

    if (this.files[i]) {

      this.fileName = this.files[i].name;

    }
  }

  addDish(){
    const dishForm: FormGroup = this.fb.group({
      dishName: this.fb.control('', Validators.required),
      rate: this.fb.control(5),
      waitingTime: this.fb.control(null),
      ingredients: this.fb.control(''),
      tags: this.fb.control(''),
      notes: this.fb.control(''),
      price: this.fb.control(null),
      currency: this.fb.control(null)
    })

    this.dishes.push(dishForm);
    this.tags.push([]);

  }

  subtractDish(){
    if(this.dishes.length>1){
      this.dishes.removeAt(this.dishes.length-1);
      this.tags.pop();
    }
  }

  get dishes(){
    return this.form.controls["dishes"] as FormArray;
  }

  showValues(){
    for(let i =0; i<this.dishes.length; i++) {
      console.log(this.dishes.at(i).value.jpg);
    }
  }

  addDishesToJournal(){
    for(let i =0 ; i < this.dishes.length; i++) {
      const formData = new FormData();
      formData.append('place', this.form.value['place']);
      formData.append('city', this.form.value['city']);
      formData.append('country', this.form.value['country']);
      formData.append('address', this.form.value['address']);
      formData.append('delivery', this.form.value['delivery']);
      formData.append('date', this.form.value['date']);
      formData.append('dishName', this.dishes.at(i).value['dishName']);
      formData.append('rate', this.dishes.at(i).value['rate']);
      if(this.dishes.at(i).value['waitingTime'] != null) formData.append('waitingTime', this.dishes.at(i).value['waitingTime']);
      else formData.append('waitingTime', '0');
      formData.append('dishDesc', this.dishes.at(i).value['ingredients']);
      formData.append('notes',this.dishes.at(i).value['notes']);
      formData.append('tags', JSON.stringify(this.tags[i]));
      if(this.dishes.at(i).value['price'] != null) formData.append('price',this.dishes.at(i).value['price']);
      else formData.append('price', '0');
      formData.append('currency',this.dishes.at(i).value['currency']);
      formData.append('image', this.files[i]);
      formData.append('username', JSON.parse(localStorage.getItem('appUser')).login)


      formData.forEach(o => console.log(o));

    this.dishService.addUserDish(formData);

      const snackBarRef = this.snackBar.open('The dishes have been saved.','OK', {
        duration: 4000
      });
    }
  }

  setCurrencyRequired(i){
    if(this.dishes.at(i).get('price').dirty) this.currencyRequired = true;
    if(this.dishes.at(i).value['price'] == null) this.currencyRequired = false;

    this.dishes.at(i).get('currency').setValidators(!this.currencyRequired ? null : [Validators.required]);
    this.dishes.at(i).get('currency').updateValueAndValidity();

    if(this.dishes.at(i).get('price').value == null) this.dishes.at(i).get('currency').setValue(null);
  }

}
