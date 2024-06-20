import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-booking-team',
  templateUrl: './add-booking-team.component.html',
  styleUrls: ['./add-booking-team.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AddBookingTeamComponent implements OnInit {
  vendors: any;
  showDropdown: boolean = false;
  showEmployeeDropdown: boolean = false;
  employeeType: any;
  selectedVendors: any[] = [];
  addOrder: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.addOrder = this.fb.group({
      customer_name: new FormControl('', [
        Validators.required,
        Validators.min(5),
      ]),
    });
  }
  orderManagement() {
    this.router.navigate(['/order-management']);
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
      image: '../../../../assets/images/booking-icons/time.png',
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
  ngOnInit(): void {
    this.vendors = [
      // { name: "DJ", selected: false },
      {
        name: 'Photography',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
      {
        name: 'Decoration',
        image: '../../../../assets/images/icons/decoration.png',
        selected: false,
      },
      {
        name: 'Music',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
      {
        name: 'Food',
        image: '../../../../assets/images/icons/rice.png',
        selected: false,
      },
    ];

    this.employeeType = [
      { vendorType: 'Waiter', selected: false },
      { vendorType: 'Cook', selected: false },
      { vendorType: 'Manager', selected: false },
    ];
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  toggleDropdownEmployee() {
    this.showEmployeeDropdown = !this.showEmployeeDropdown;
  }

  toggleVendorSelection(vendor: any) {
    vendor.selected = !vendor.selected;
    if (vendor.selected) {
      this.selectedVendors.push(vendor);
    } else {
      this.selectedVendors = this.selectedVendors.filter(
        (v: any) => v.name !== vendor.name
      );
    }
  }

  submitOrder() {
    const orderData = {
      ...this.addOrder.value,
      selectedVendors: this.selectedVendors,
    };
    console.log('Add Order', orderData);

    this.addOrder.reset();
  }
}
