import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-bookings',
  templateUrl: './add-bookings.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./add-bookings.component.scss'],
})
export class AddBookingsComponent implements OnInit {
  imageUrl: string = '';
  offlineChecked: boolean = true;
  onlineChecked: boolean = false;
  financeManagement() {
    this.router.navigate(['/expense-manage']);
  }
  editBooking() {
    this.router.navigate(['/edit-booking']);
  }
  halldetail: any = [
    {
      name: 'Branch',
      image: '../../../../assets/images/booking-icons/library.png',
      vendertype: 'The Grand Avenu',
    },
    {
      name: 'FLoor',
      image: '../../../../assets/images/booking-icons/floor.png',
      vendertype: '2nd',
    },
    {
      name: 'Hall',
      image: '../../../../assets/images/icons/text.png',
      vendertype: 'Title of Hall',
    },
    {
      name: 'Event Date',
      image: '../../../../assets/images/booking-icons/date.png',
      vendertype: '02 Mar 2023 ',
    },
    {
      name: 'Time Slot',
      image: '../../../../assets/images/booking-icons/time.png',
      vendertype: 'Morning - 08am  to 01pm',
    },
    {
      name: 'Seating',
      image: '../../../../assets/images/booking-icons/seating.png',
      vendertype: '7566',
    },
  ];
  detail: any = [
    {
      name: 'Customer Name',
      image: '../../../../assets/images/icons/text.png',
      vendertype: 'Abc',
    },
    {
      name: 'Email',
      image: '../../../../assets/images/icons/file-text.png',
      vendertype: 'abce@gmail.com',
    },
    {
      name: 'Address on Map',
      image: '../../../../assets/images/icons/address-map.png',
      vendertype: 'Parachinar Pakistan',
    },
    {
      name: 'Contact No',
      image: '../../../../assets/images/icons/call.png',
      vendertype: '0300-1234567',
    },
    {
      name: 'CNIC',
      image: '../../../../assets/images/icons/cnic.png',
      vendertype: '21123-1254598-3',
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.imageUrl = params['data'];
    });
  }

  toggleCheckbox(id: string) {
    if (id === 'off-trans' && this.offlineChecked) {
      this.onlineChecked = false;
    } else if (id === 'on-trans' && this.onlineChecked) {
      this.offlineChecked = false;
    }
  }
}
