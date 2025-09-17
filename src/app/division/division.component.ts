import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})

export class DivisionComponent implements OnInit {
  title = "Division";
  role
  public baseUrl: string = 'http://localhost:53800';
  public listDivision: any = [];
  public listDistrict: any = [];
  public division:number = 0;
  public district:number = 0;
  public res: any;
  public isLoggedIn: string;
  public loggedUser: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService) {
    // this.isLoggedIn = localStorage.getItem('isLoggedIn');
    // this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    // if (this.isLoggedIn !== 'true') {
    //   this.router.navigate(['/login']);
    // } else if (this.isLoggedIn === 'true') {
    //   if (this.loggedUser.role !== 'Manager') {
    //     this.router.navigate(['/booking']);
    //   }
    // }
  }

  ngOnInit() {
    this.GetDivisions();
  }

  GetDivisions() {
    this.http.get(this.baseUrl + '/api/values/GetDivisions').subscribe(result => {
      this.listDivision = result as any;
    }, error => console.error(error));
  }

  GetDistrictsByDivision() {
    this.listDistrict = [];
    this.http.get(this.baseUrl + '/api/values/GetDistrictsByDivision?divisionId='+this.division).subscribe(result => {
      this.listDistrict = result as any;
    }, error => console.error(error));
  }

  changeDivision(){
    this.GetDistrictsByDivision();
  }

}
