import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  title = "Login";
  public baseUrl: string = 'http://localhost:53800';
  public res: any;
  public isLoggedIn: string;

  public loginForm: FormGroup;

  constructor(private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn');
    if (this.isLoggedIn === 'true') {
      this.router.navigate(['/bus']);
    }
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
      userPass: new FormControl('', Validators.required)
    });
  }

  login() {

    if (this.loginForm.invalid) {
      return;
    }

    const formModel = new FormData();
    formModel.append('userName', this.loginForm.value.userName);
    formModel.append('userPass', this.loginForm.value.userPass);

    this.http.post(this.baseUrl + '/api/account/login', formModel).subscribe(result => {
      this.res = result as any;
      var type = 'info';
      if (this.res.resstate) {
        this.reset();
        type = 'success';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedUser', JSON.stringify(this.res.resdata));
        this.router.navigate(['/bus']);
        location.reload();
      } else {
        type = 'danger';
      }
      this.messageService.add({ severity: type, summary: type, detail: this.res.message });
    }, error => console.error(error));
  }

  reset() {
    this.loginForm.setValue({
      userName: null,
      userPass: null
    });
  }
}
