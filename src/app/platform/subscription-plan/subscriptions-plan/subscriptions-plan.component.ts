import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscriptions-plan',
  templateUrl: './subscriptions-plan.component.html',
  styleUrls: ['./subscriptions-plan.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class SubscriptionsPlanComponent {
  selectedButton: string = 'hall';
  constructor(private router: Router) {}

  ngOnInit(): void {}
  selectButton(button: string) {
    this.selectedButton = button;
  }
  hallData = [
    { column1: 'Hall 1', column2: 'Details 1' },
    { column1: 'Hall 2', column2: 'Details 2' },
    // Add more data as needed
  ];
  vendorData = [
    {
      column1: '1',
      column2: 'Details 1',
      column3: 'Vendor 1',
      column4: 'Details 1',
    },
    {
      column1: '2',
      column2: 'Details 2',
      column3: 'Vendor 1',
      column4: 'Details 1',
    },
    // Add more data as needed
  ];
  addHall() {
    this.router.navigate(['subsciption-plan/add-subsciption-plan']);
  }
  addVendor() {
    this.router.navigate(['subsciption-plan/add-subsciption-plan']);
  }
}
