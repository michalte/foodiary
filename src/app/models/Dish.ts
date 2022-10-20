export interface Dish {

  id: number;
  place: string;
  city: string;
  address: string;
  date: Date
  dishName: string;
  rate: number;
  waitingTime: number;
  delivery: boolean;
  dishDesc: string;
  notes: string;
  tags: string[];
  image: string;
  owner;

}
