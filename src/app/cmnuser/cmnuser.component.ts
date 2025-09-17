import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-cmnuser',
  templateUrl: './cmnuser.component.html',
  styleUrls: ['./cmnuser.component.css']
})

export class CmnuserComponent implements OnInit {
  title = "User";
  public baseUrl: string = 'http://localhost:53800';
  public res: any;
  public isLoggedIn: string;
  public loggedUser: any = {};
  
  public listCmnuser: any = [];
  public cmnuserForm: FormGroup;
  public listRole: any = [];

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
    this.getAllRole();
    this.getAll();
  }
  
  createForm() {
    this.cmnuserForm = this.formBuilder.group({
      userId: 0,
      userName: new FormControl('', Validators.required),
      userPass: new FormControl('', Validators.required),
      role: new FormControl(''),
      fullName: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required)
    });
  }

  getAll() {
    this.http.get(this.baseUrl + '/api/cmnuser/getall').subscribe(result => {
      this.listCmnuser = result as any;
    }, error => console.error(error));
  }

  getAllRole() {
    this.http.get(this.baseUrl + '/api/cmnuser/getallrole').subscribe(result => {
      this.listRole = result as any;
    }, error => console.error(error));
  }

  onSubmit() {

    if (this.cmnuserForm.invalid) {
      return;
    }
    
    const formModel = new FormData();
    formModel.append('userId', this.cmnuserForm.value.userId);
    formModel.append('userName', this.cmnuserForm.value.userName);
    formModel.append('userPass', this.cmnuserForm.value.userPass);
    formModel.append('role', this.cmnuserForm.value.role);
    formModel.append('fullName', this.cmnuserForm.value.fullName);
    formModel.append('mobile', this.cmnuserForm.value.mobile);
    formModel.append('email', this.cmnuserForm.value.email);

    this.http.post(this.baseUrl + '/api/cmnuser/save', formModel).subscribe(result => {
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
    this.cmnuserForm.setValue({
      userId: 0,
      userName: null,
      userPass: null,
      role: '',
      fullName: null,
      mobile: null,
      email: null
    });
  }

  //Get by ID
  edit(e, m) {
    e.preventDefault();

    this.cmnuserForm.setValue({
      userId: m.userId,
      userName: m.userName,
      userPass: m.userPass,
      role: m.role,
      fullName: m.fullName,
      mobile: m.mobile,
      email: m.email
    });

  }

  //Delete
  delete(e, m) {
    e.preventDefault();
    var IsConf = confirm('You are about to delete ' + m.userName + '. Are you sure?');
    if (IsConf) {
      this.http.delete(this.baseUrl + '/api/cmnuser/deletebyid/' + m.userId).subscribe(result => {
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
