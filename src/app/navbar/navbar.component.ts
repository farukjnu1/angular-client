import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
//import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
//import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
//import { MessageService } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  title = "navbar";
  public loginLogout: string = "Login";
  public loggedUser: any = {};
  public fullName: string = "";
  public role: string = "";
  public manager: string = "Manager";

  constructor(private router: Router) { }

  ngOnInit() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      this.loginLogout = "Login";
    } else {
      this.loginLogout = "Logout";
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      this.fullName = this.loggedUser.fullName;
      this.role = this.loggedUser.role;
    }
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedUser');
    location.reload();
  }
  
}
