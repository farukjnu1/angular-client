import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { HttpClientModule } from 'node_modules/@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouteComponent } from './route/route.component';
import { BusComponent } from './bus/bus.component';
import { CmnuserComponent } from './cmnuser/cmnuser.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { BookingComponent } from './booking/booking.component';
import { LoginComponent } from './login/login.component';
import { DivisionComponent } from './division/division.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RouteComponent,
    BusComponent,
    CmnuserComponent,
    ScheduleComponent,
    BookingComponent,
    LoginComponent,
    DivisionComponent
  ],
  imports: [
    BrowserModule,
	  BrowserAnimationsModule,
    ToastModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'route',
        component: RouteComponent
      },
      {
        path: 'bus',
        component: BusComponent
      },
      {
        path: 'cmnuser',
        component: CmnuserComponent
      },
      {
        path: 'schedule',
        component: ScheduleComponent
      },
      {
        path: 'booking',
        component: BookingComponent
      },
      {
        path: 'division',
        component: DivisionComponent
      },
      { path: '**', component: LoginComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
