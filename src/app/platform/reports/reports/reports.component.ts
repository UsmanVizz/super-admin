import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportChartComponent } from '../report-chart/report-chart.component';
import { ReportListComponent } from '../report-list/report-list.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ReportChartComponent,
    ReportListComponent,
  ],
})
export class ReportsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
   
}
