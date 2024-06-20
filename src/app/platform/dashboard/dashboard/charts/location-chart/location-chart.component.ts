// location-chart.component.ts

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-location-chart',
  templateUrl: './location-chart.component.html',
  styleUrls: ['./location-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class LocationChartComponent implements OnInit {
  @ViewChild('chartCanvas2', { static: true }) canvasRef!: ElementRef;
  private chart: any; // Type is 'any' since amCharts typings might not match exactly

  constructor() {}

  ngOnInit(): void {
    this.locationChartCanvas();
  }
  locationChartCanvas() {
    this.chart = am4core.create(
      this.canvasRef.nativeElement,
      am4charts.PieChart
    );
    this.chart.logo.disabled = true;
    // Set up the data for the pie chart
    this.chart.data = [
      {
        country: 'Customer',
        litres: 30,
        color: am4core.color('#269F07'),
      },
      {
        country: 'Vendor',
        litres: 30,
        color: am4core.color('#CA0303'),
      },
      {
        country: 'Branches',
        litres: 40,
        color: am4core.color('#052EBE'),
      },
    ];

    // Add and configure Series
    let pieSeries = this.chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'litres';
    pieSeries.dataFields.category = 'country';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = 'color';
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    // Disable default ticks
    pieSeries.ticks.template.disabled = true;

    // Show value labels in the center of each slice
    pieSeries.labels.template.text = '{value.percent.formatNumber("#")}%';
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color('white');
    pieSeries.alignLabels = false;
    // Configure legend
    this.chart.legend = new am4charts.Legend();
    this.chart.legend.useDefaultMarker = false;
    this.chart.legend.itemContainers.template.togglable = false;
    this.chart.legend.dataItems.values.forEach((dataItem: any) => {
      dataItem.label.text = '{name}';
    });

    var marker = this.chart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 1;
    this.chart.legend.markers.template.width = 7;
    this.chart.legend.markers.template.height = 7;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('#ccc');
  }

  // locationChartCanvas() {
  //   this.chart = am4core.create(
  //     this.canvasRef.nativeElement,
  //     am4charts.PieChart
  //   );
  //   // this.chart.legend = new am4charts.Legend();
  //   this.chart.legend = new am4charts.Legend();
  //   // this.chart.legend.markers.template.width = 12;
  //   // this.chart.legend.markers.template.height = 12;
  //   // this.chart.legend.markers.template.markerType = 'circle';
  //   this.chart.legend.useDefaultMarker = true;
  //   var marker = this.chart.legend.markers.template.children.getIndex(0);
  //   marker.cornerRadius(12, 12, 12, 12);
  //   marker.strokeWidth = 1;
  //   this.chart.legend.markers.template.width = 12;
  //   this.chart.legend.markers.template.height = 12;
  //   marker.strokeOpacity = 1;
  //   marker.stroke = am4core.color('#ccc');

  //   this.chart.data = [
  //     {
  //       country: 'Customer',
  //       litres: 50,
  //       color: am4core.color('#269F07'),
  //     },
  //     {
  //       country: 'Vendor',
  //       litres: 30,
  //       color: am4core.color('#CA0303'),
  //     },
  //     {
  //       country: 'Branches',
  //       litres: 20,
  //       color: am4core.color('#052EBE'),
  //     },
  //   ];

  //   // Add and configure Series
  //   let pieSeries = this.chart.series.push(new am4charts.PieSeries());
  //   pieSeries.dataFields.value = 'litres';
  //   pieSeries.dataFields.category = 'country';
  //   pieSeries.slices.template.stroke = am4core.color('#fff');
  //   pieSeries.slices.template.strokeOpacity = 1;
  //   pieSeries.slices.template.propertyFields.fill = 'color';
  //   pieSeries.hiddenState.properties.opacity = 1;
  //   pieSeries.hiddenState.properties.endAngle = -90;
  //   pieSeries.hiddenState.properties.startAngle = -90;
  //   pieSeries.labels.template = true;
  //   pieSeries.ticks.template.disabled = true; // Disable default ticks

  //   let label = pieSeries.createChild(am4core.Label);
  //   label.text = "{category}: {value.percent.formatNumber('#.0')}%";
  //   label.horizontalCenter = 'middle';
  //   label.verticalCenter = 'middle';
  //   this.chart.hiddenState.properties.radius = am4core.percent(0);
  //   pieSeries.labels.template.labelPosition = 'fixed';
  //   pieSeries.labels.template.radius = am4core.percent(-40);
  // }
}
