import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class EditBookingComponent implements OnInit {
  vendors: any;
  showDropdown: boolean = false;
  showEmployeeDropdown: boolean = false;
  employeeType: any;
  selectedVendors: any[] = []; // Array to hold selected vendors
  addOrder: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.addOrder = this.fb.group({
      customer_name: new FormControl('', [
        Validators.required,
        Validators.min(5),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [
        Validators.required,
        this.addressValidator(),
      ]),
      cnic: new FormControl('', [Validators.required]),
      zip_code: new FormControl('', [
        Validators.pattern(/^[0-9]*$/),
        Validators.maxLength(8),
      ]),
    });
  }
  orderManagement() {
    this.router.navigate(['/expense-manage']);
  }
  addVendor() {
    this.router.navigate(['/add-vendor-booking']);
  }
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
  detail: any = [
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
  emailCorrection() {
    const emailControl: any = this.addOrder.get('email');
    if (emailControl?.value) {
      const domain = emailControl.value.substring(
        emailControl?.value.lastIndexOf('@') + 1
      );
      if (domain !== 'gmail.com' && domain !== 'yopmail.com') {
        emailControl.setErrors({ invalidDomain: true });
      } else {
        emailControl.setErrors(null);
      }
    }
  }

  getEmailErrorMessage() {
    if (this.addOrder.get('email')?.hasError('required')) {
      return 'Email address is required.';
    }
    return 'Please enter a valid email address. Email address should be yopmail and gmail.com.';
  }

  addressValidator() {
    return Validators.pattern(
      /^[^!@#$%^&*()\[\]{}'`~]+(,[^!@#$%^&*()\[\]{}'`~]+)*(\/[^!@#$%^&*()\[\]{}'`~]+)*$/
    );
  }

  zipCodeValidator(event: KeyboardEvent) {
    const input = event.key;
    const isNumeric = /^[0-9]$/.test(input);
    if (!isNumeric) {
      event.preventDefault();
    }
  }

  formatCnic(event: any) {
    const input = event.target.value.replace(/\D/g, '').substring(0, 13);
    const formattedInput = input.replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3');
    event.target.value = formattedInput;
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
