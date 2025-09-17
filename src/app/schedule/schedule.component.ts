import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-route',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  title = "Schdule";
  public isLoggedIn: string;
  public baseUrl: string = 'http://localhost:53800';

  public res: any;
  public listSchedule: any = [];
  public listRoute: any = [];
  public listBus: any = [];
  public scheduleForm: FormGroup;

  constructor(private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn');
    if (this.isLoggedIn !== 'true') {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.createForm();
    this.getAllBus();
    this.getAllRoute();
    this.getAll();
  }
  
  createForm() {
    this.scheduleForm = this.formBuilder.group({
      scheduleId: 0,
      departureTime: new FormControl('', Validators.required),
      arrivalTime: new FormControl('', Validators.required),
      busId: new FormControl('', Validators.required),
      routeId: new FormControl('', Validators.required),
      actualDepartureTime: new FormControl(''),
      actualArrivalTime: new FormControl(''),
      scheduleCancel: new FormControl(''),
      busStatus: new FormControl('')
    });
  }

  getAllBus() {
    this.http.get(this.baseUrl + '/api/bus/getall').subscribe(result => {
      this.listBus = result as any;
    }, error => console.error(error));
  }

  getAllRoute() {
    this.http.get(this.baseUrl + '/api/route/getall').subscribe(result => {
      this.listRoute = result as any;
      
    }, error => console.error(error));
  }

  getAll() {
    this.http.get(this.baseUrl + '/api/schedule/getall').subscribe(result => {
      this.listSchedule = result as any;

    }, error => console.error(error));
  }

  onSubmit() {

    if (this.scheduleForm.invalid) {
      return;
    }

    const formModel = new FormData();
    formModel.append('scheduleId', this.scheduleForm.value.scheduleId);
    formModel.append('routeId', this.scheduleForm.value.routeId);
    formModel.append('departureTime', this.scheduleForm.value.departureTime);
    formModel.append('arrivalTime', this.scheduleForm.value.arrivalTime);
    formModel.append('busId', this.scheduleForm.value.busId);
    formModel.append('actualDepartureTime', this.scheduleForm.value.actualDepartureTime);
    formModel.append('actualArrivalTime', this.scheduleForm.value.actualArrivalTime);
    formModel.append('scheduleCancel', this.scheduleForm.value.scheduleCancel);
    formModel.append('busStatus', this.scheduleForm.value.busStatus);

    this.http.post(this.baseUrl + '/api/schedule/save', formModel).subscribe(result => {
      this.res = result as any;
      var type = 'info';
      if (this.res.resstate) {
        this.getAll();
        this.reset();
        type = 'success';
      }
      this.messageService.add({ severity: type, summary: type, detail: this.res.message });
    }, error => console.error(error));
  }

  reset() {
    this.scheduleForm.setValue({
      scheduleId:0,
      routeId: 0,
      departureTime: null,
      arrivalTime: null,
      busId: null,
      actualDepartureTime: null,
      actualArrivalTime: null,
      scheduleCancel: false,
      busStatus:null
    });
  }

  //Get by ID
  edit(e, m) {
    e.preventDefault();
    this.scheduleForm.setValue({
      scheduleId: m.scheduleId,
      routeId: m.routeId,
      departureTime: m.departureTime,
      arrivalTime: m.arrivalTime,
      busId: m.busId,
      actualDepartureTime: m.actualDepartureTime,
      actualArrivalTime: m.actualArrivalTime,
      scheduleCancel: m.scheduleCancel,
      busStatus: m.busStatus
    });
  }
  
  //Delete
  delete(e, m) {
    e.preventDefault();
    var IsConf = confirm('You are about to delete ' + m.scheduleId + '. Are you sure?');
    if (IsConf) {
      this.http.delete(this.baseUrl + '/api/schedule/deletebyid/' + m.scheduleId).subscribe(result => {
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
