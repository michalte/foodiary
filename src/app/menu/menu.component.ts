import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() menuOpened = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  logout(){
    this.authenticationService.logout();
  }

}
