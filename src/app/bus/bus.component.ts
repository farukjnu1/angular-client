import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.css']
})

export class BusComponent implements OnInit {
  title = "Bus";
  role
  public baseUrl: string = 'http://localhost:53800';
  public listBus: any = [];
  public res: any;
  public busForm: FormGroup;
  public isLoggedIn: string;
  public loggedUser: any = {};

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
        this.router.navigate(['/booking']);
      }
    }
  }

  ngOnInit() {
    this.createForm();
    this.getAll();
  }

  createForm() {
    this.busForm = this.formBuilder.group({
      busId: 0,
      busName: new FormControl('', Validators.required),
      busType: new FormControl('', Validators.required),
      noOfSeat: new FormControl('', Validators.required),
      licenseNo: new FormControl('', Validators.required),
      fitnessStatus: new FormControl('')
    });
  }

  getAll() {
    this.http.get(this.baseUrl + '/api/bus/getall').subscribe(result => {
      this.listBus = result as any;
    }, error => console.error(error));
  }

  onSubmit() {

    if (this.busForm.invalid) {
      return;
    }

    const formModel = new FormData();
    formModel.append('busId', this.busForm.value.busId);
    formModel.append('busName', this.busForm.value.busName);
    formModel.append('busType', this.busForm.value.busType);
    formModel.append('noOfSeat', this.busForm.value.noOfSeat);
    formModel.append('licenseNo', this.busForm.value.licenseNo);
    formModel.append('fitnessStatus', this.busForm.value.fitnessStatus);

    this.http.post(this.baseUrl + '/api/bus/save', formModel).subscribe(result => {
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
    this.busForm.setValue({
      busId: 0,
      busName: null,
      busType: null,
      noOfSeat: '',
      licenseNo: '',
      fitnessStatus: ''
    });
  }

  //Get by ID
  edit(e, m) {
    e.preventDefault();

    this.busForm.setValue({
      busId: m.busId,
      busName: m.busName,
      busType: m.busType,
      noOfSeat: m.noOfSeat,
      licenseNo: m.licenseNo,
      fitnessStatus: m.fitnessStatus
    });

  }

  //Delete
  delete(e, m) {
    e.preventDefault();
    var IsConf = confirm('You are about to delete ' + m.busName + '. Are you sure?');
    if (IsConf) {
      this.http.delete(this.baseUrl + '/api/bus/deletebyid/' + m.busId).subscribe(result => {
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
