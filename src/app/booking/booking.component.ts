import { Component, OnInit, ElementRef, ViewChild, HostListener, Inject, AfterViewInit, ViewChildren } from '@angular/core';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { debounce } from 'rxjs/operators';
import { HttpClientModule, HttpClient } from 'node_modules/@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { forEach } from '@angular/router/src/utils/collection';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})

export class BookingComponent implements OnInit {
  title = "Booking";
  public baseUrl: string = 'http://localhost:53800';
  public isLoggedIn: string;

  public listBooking: any = [];
  public listRoute: any = [];
  public res: any;
  public bookingForm: FormGroup;
  public startPoint: string = "";
  public endPoint: string = "";
  public listSchedule: any = [];
  public listVmBooking: any = [];
  public oVmBooking: any = {};
  public unitPrice: number = 0;
  public listScheduleDetail: any = [];

  // view switching
  public viewSearchSchedule: boolean = false;
  public viewBooking: boolean = false;

  // seat count
  //public ReserveSeat: number = 0;
  //public SelectedSeat: number = 0;
  //public EmptySeat: number = 40 - this.ReserveSeat;
  public selectedSeats: any = [];
  
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
    this.getAllRoutes();
    this.viewSearchSchedule = true;
    this.viewBooking = false;
  }

  createForm() {
    this.bookingForm = this.formBuilder.group({
      bookingId: 0,
      customerName: new FormControl('', Validators.required),
      customerMobile: new FormControl('', Validators.required),
      bookedDate: new FormControl(''),
      bookedStatus: new FormControl(''),
      price: new FormControl('', Validators.required),
      cancelDate: new FormControl(''),
      returnAmount: new FormControl(''),
      returnStatus: new FormControl(''),
      seats: '',
      busId: 0,
      scheduleId: 0,
      ids: ''
    });
  }

  getAll(scheduleId, busId) {
    this.http.get(this.baseUrl + '/api/booking/getall/' + scheduleId + '/' + busId).subscribe(result => {
      this.listBooking = result as any;
    }, error => console.error(error));
  }

  /*getBookingByScheduleId(scheduleId, busId) {
    this.http.get(this.baseUrl + '/api/booking/getbookingbyscheduleid/' + scheduleId + '/' + busId).subscribe(result => {
      this.listBooking = result as any;
    }, error => console.error(error));
  }*/
  
  /*getBookingByScheduleId1(scheduleId, busId) {
    this.http.get(this.baseUrl + '/api/booking/getbookingbyscheduleid/' + scheduleId + '/' + busId).subscribe(result => {
      var res = result as any;
      this.listVmBooking = res.listVmBooking;
    }, error => console.error(error));
  }*/
  
  getAllRoutes() {
    this.http.get(this.baseUrl + '/api/route/getall').subscribe(result => {
      this.listRoute = result as any;
    }, error => console.error(error));
  }
  
  searchSchedule() {
    this.http.get(this.baseUrl + '/api/booking/getschedule/' + this.startPoint + '/' + this.endPoint).subscribe(result => {
      var res = result as any;
      this.listSchedule = res.listVmSchedule;
    }, error => console.error(error));
  }

  //getscheduledetail
  getscheduledetail(scheduleId, busId) {
    this.http.get(this.baseUrl + '/api/booking/getscheduledetail/' + scheduleId + '/' + busId).subscribe(result => {
      var res = result as any;
      this.listScheduleDetail = res;
    }, error => console.error(error));
  }

  public sits: string = '';
  onSubmit() {
    // set value
    this.bookingForm.value.price = this.selectedSeats.length * this.unitPrice;
    var ids = '';
    for (var i = 0; i < this.selectedSeats.length; i++) {
      this.bookingForm.value.busId = this.selectedSeats[i].busId;
      this.bookingForm.value.scheduleId = this.selectedSeats[i].scheduleId;
      ids += i === 0 ? this.selectedSeats[i].scheduleDetailsId : ',' + this.selectedSeats[i].scheduleDetailsId;
      this.sits += i === 0 ? this.selectedSeats[i].seatNo.toString() : ',' + this.selectedSeats[i].seatNo.toString();
    }
    this.bookingForm.value.ids = ids;
    this.bookingForm.value.seats = this.sits;

    //if (this.bookingForm.invalid) {
    //  return;
    //}
    if (this.bookingForm.value.busId === 0 || this.bookingForm.value.scheduleId === 0 || this.bookingForm.value.ids === '') {
      return;
    }
    
    const formModel = new FormData();
    formModel.append('bookingId', this.bookingForm.value.bookingId);
    formModel.append('customerName', this.bookingForm.value.customerName);
    formModel.append('customerMobile', this.bookingForm.value.customerMobile);
    formModel.append('bookedDate', this.bookingForm.value.bookedDate);
    formModel.append('bookedStatus', this.bookingForm.value.bookedStatus);
    formModel.append('price', this.bookingForm.value.price);
    formModel.append('cancelDate', this.bookingForm.value.cancelDate);
    formModel.append('returnAmount', this.bookingForm.value.returnAmount);
    formModel.append('returnStatus', this.bookingForm.value.returnStatus);
    formModel.append('busId', this.bookingForm.value.busId);
    formModel.append('scheduleId', this.bookingForm.value.scheduleId);
    formModel.append('ids', this.bookingForm.value.ids);
    
    this.http.post(this.baseUrl + '/api/booking/save', formModel).subscribe(result => {
      this.res = result as any;
      var type = 'info';
      if (this.res.resstate) {
        //this.getAll(this.bookingForm.value.scheduleId, this.bookingForm.value.busId);
        this.searchSchedule();
        this.reset();
        type = 'success';
        this.backToSchedule();
      } else {
        type = 'danger';
      }
      this.messageService.add({ severity: type, summary: type, detail: this.res.message });
    }, error => console.error(error));
  }

  backToSchedule(){
    this.viewSearchSchedule = true;
    this.viewBooking = false;
  }

  reset() {
    this.bookingForm.setValue({
      bookingId: 0,
      customerName: '',
      customerMobile: '',
      bookedDate: null,
      bookedStatus: '',
      price: 0,
      cancelDate: null,
      returnAmount: 0,
      returnStatus: false,
      busId: 0,
      scheduleId: 0,
      ids: '',
      seats:''
    });
    this.selectedSeats = [];
  }

  //Get by ID
  edit(e, m) {
    e.preventDefault();
    this.bookingForm.setValue({
      bookingId: m.bookingId,
      customerName: m.customerName,
      customerMobile: m.customerMobile,
      bookedDate: m.bookedDate,
      bookedStatus: m.bookedStatus,
      price: m.price,
      cancelDate: m.cancelDate,
      returnAmount: m.returnAmount,
      returnStatus: m.returnStatus,
      busId: m.busId,
      scheduleId: m.scheduleId,
      ids: m.ids,
      seats:''
    });
  }

  //Delete
  delete(e, m) {
    e.preventDefault();
    var isConf = confirm('You are about to delete ' + m.customerName + ' booking. Are you sure?');
    if (isConf) {
      this.http.delete(this.baseUrl + '/api/booking/deletebyid/' + m.bookingId).subscribe(result => {
        this.res = result as any;
        var type = 'info';
        if (this.res.resstate) {
          this.getAll(m.scheduleId, m.busId);
          //this.getBookingByScheduleId(m.scheduleId, m.busId);
          this.reset();
          type = 'success';
        } else {
          type = 'danger';
        }
        this.messageService.add({ severity: type, summary: type, detail: this.res.message });
      }, error => console.error(error));
    }
  }

  booking(e, m) {
    this.viewSearchSchedule = false;
    this.viewBooking = true;
    this.getscheduledetail(m.scheduleId, m.busId);
    this.oVmBooking = m;
    this.unitPrice = m.unitPrice;
    //this.countReserveSeat();
    //this.getBookingByScheduleId(m.scheduleId, m.busId);
    this.getAll(m.scheduleId, m.busId);
  }

  countReserveSeat() {
    for (var i = 0; i < this.listScheduleDetail.length; i++) {
      for (var j = 0; j < this.listScheduleDetail[i].vmScheduleDetailSeats.length; j++) {
        if (this.listScheduleDetail[i].vmScheduleDetailSeats[j].seatColor === 'red') {
          //this.ReserveSeat += 1;
        }
      }
    }
  }

  
  book(e, m) {
    if (m.seatColor === 'red') {
      alert(m.seatNo + ' already booked!');
    } else {
      var alpha = m.seatNo.substring(0, 1)
      for (var i = 0; i < this.listScheduleDetail.length; i++) {
        if (this.listScheduleDetail[i].row === alpha) {
          for (var j = 0; j < this.listScheduleDetail[i].vmScheduleDetailSeats.length; j++) {
            if (this.listScheduleDetail[i].vmScheduleDetailSeats[j].seatNo === m.seatNo) {
              if (m.seatColor === 'cornflowerblue') {
                this.listScheduleDetail[i].vmScheduleDetailSeats[j].seatColor = 'green';
                this.selectedSeats.push(m);
              } else if (m.seatColor === 'green') {
                this.listScheduleDetail[i].vmScheduleDetailSeats[j].seatColor = 'cornflowerblue';
                for (var i = 0; i < this.selectedSeats.length; i++) {
                  if (this.selectedSeats[i].seatNo === m.seatNo) {
                    this.selectedSeats.splice(i, 1);
                  }
                }
              }
            }
          }
        }
      }
    }
    //this.SelectedSeat = this.selectedSeats.length;
    //this.EmptySeat = 40 - (this.SelectedSeat + this.ReserveSeat);
    
  }

}
