import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-manage-customer',
  templateUrl: './view-manage-customer.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./view-manage-customer.component.scss'],
})
export class ViewManageCustomerComponent {
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  constructor(private router: Router) {}
  customerDetail() {
    this.router.navigate(['/manage-customer']);
  }
}
