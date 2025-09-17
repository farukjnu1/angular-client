import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  title = "Route";
  public isLoggedIn: string;
  public baseUrl: string = 'http://localhost:53800';
  public loggedUser: any = {};

  public listRoute: any = [];
  public listBus: any = [];
  public res: any;
  public routeForm: FormGroup;

  constructor(private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn');
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.isLoggedIn !== 'true') {
      this.router.navigate(['/login']);
    } else if (this.isLoggedIn === 'true') {
      if (this.loggedUser.role !== 'Manager') {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnInit() {
    this.createForm();
    this.getAllBus();
    this.getAll();
  }

  createForm() {
    this.routeForm = this.formBuilder.group({
      routeId: 0,
      routeName: new FormControl('', Validators.required),
      startPoint: new FormControl('', Validators.required),
      endPoint: new FormControl('', Validators.required),
      busId: new FormControl('', Validators.required),
      unitPrice: new FormControl('', Validators.required)
    });
  }

  getAllBus() {
    this.http.get(this.baseUrl + '/api/bus/getall').subscribe(result => {
      this.listBus = result as any;
    }, error => console.error(error));
  }

  getAll() {
    this.http.get(this.baseUrl + '/api/route/getall').subscribe(result => {
      this.listRoute = result as any;
      
    }, error => console.error(error));

  }

  onSubmit() {

    if (this.routeForm.invalid) {
      return;
    }

    const formModel = new FormData();
    formModel.append('routeId', this.routeForm.value.routeId);
    formModel.append('routeName', this.routeForm.value.routeName);
    formModel.append('startPoint', this.routeForm.value.startPoint);
    formModel.append('endPoint', this.routeForm.value.endPoint);
    formModel.append('busId', this.routeForm.value.busId);
    formModel.append('unitPrice', this.routeForm.value.unitPrice);

    this.http.post(this.baseUrl + '/api/route/save', formModel).subscribe(result => {
      this.res = result as any;
      var type = 'info';
      if (this.res.resstate) {
        this.getAll();
        this.reset();
        type = 'success';
      } else {
        type = 'danger';
      }
      this.messageService.add({ severity: type, summary: type, detail: this.res.message });
    }, error => console.error(error));
  }

  reset() {
    this.routeForm.setValue({
      routeId: 0,
      routeName: null,
      startPoint: null,
      endPoint: null,
      busId: null,
      unitPrice:null
    });
  }

  //Get by ID
  edit(e, m) {
    e.preventDefault();

    this.routeForm.setValue({
      routeId: m.routeId,
      routeName: m.routeName,
      startPoint: m.startPoint,
      endPoint: m.endPoint,
      busId: m.busId,
      unitPrice: m.unitPrice
    });

  }



  //Delete
  delete(e, m) {
    e.preventDefault();
    var IsConf = confirm('You are about to delete ' + m.routeName + '. Are you sure?');
    if (IsConf) {
      this.http.delete(this.baseUrl + '/api/route/deletebyid/' + m.routeId).subscribe(result => {
        this.res = result as any;
        var type = 'info';
        if (this.res.resstate) {
          this.getAll();
          this.reset();
          type = 'success';
        } else {
          type = 'danger';
        }
        this.messageService.add({ severity: type, summary: type, detail: this.res.message });
      }, error => console.error(error));
    }
  }

}
