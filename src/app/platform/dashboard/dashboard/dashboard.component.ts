import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerChartComponent } from './charts/customer-chart/customer-chart.component';
import { LocationChartComponent } from './charts/location-chart/location-chart.component';
import { RevenueChartComponent } from './charts/revenue-chart/revenue-chart.component';
import { GoogleMapsComponent } from 'src/app/shared/google-maps/google-maps.component';

declare var google: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    [
      RevenueChartComponent,
      CustomerChartComponent,
      LocationChartComponent,
      GoogleMapsComponent,
    ],
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('binMap') binMap: GoogleMapsComponent | any;
  animatedValues: { [key: string]: number } = {
    trafficValue: 0,
    newUserValue: 0,
    salesValue: 0,
    performanceValue: 0,
    performanceValue1: 0,
    performanceValue2: 0,
  };
  values: { [key: string]: number } = {
    trafficValue: 5,
    newUserValue: 3.48,
    salesValue: 1.1,
    performanceValue: 18,
    performanceValue1: 12,
    performanceValue2: 15,
  };
  duration: number = 2000;
  animationInterval: any;

  constructor() {}

  ngOnInit(): void {
    for (const key in this.animatedValues) {
      if (this.animatedValues.hasOwnProperty(key)) {
        this.animateValue(key);
      }
    }
    setTimeout(() => {
      this.binMap.setupLocations();
    }, 2000);
  }

  animateValue(key: string) {
    let start = 0;
    const increment = ((this.values[key] - start) / this.duration) * 10;
    const animate = () => {
      start += increment;
      this.animatedValues[key] = Math.min(start, this.values[key]);
      if (start < this.values[key]) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  onRatingClicked(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const value = target.dataset['value'];
    if (value) {
      console.log('Rating clicked:', value);
    }
  }
}
