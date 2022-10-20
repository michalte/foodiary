export class AppUser {
  login: string;
  email: string;
  password: string;
  gender: string;
  role: string;
  authorities: [];
  isUnbanned: boolean;
  isActive: boolean;
  name: string;


  constructor() {
    this.login = "";
    this.email = "";
    this.password = "";
    this.gender = "";
    this.role = "";
    this.isUnbanned = false;
    this.isActive = false;
    this.name = "";
    this.authorities = [];
  }


}
