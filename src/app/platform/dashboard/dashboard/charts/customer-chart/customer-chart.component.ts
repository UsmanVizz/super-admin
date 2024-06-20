import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-customer-chart',
  templateUrl: './customer-chart.component.html',
  styleUrls: ['./customer-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class CustomerChartComponent implements OnInit {
  chart: am4charts.XYChart | undefined;
  series1Visible: boolean = true;
  series2Visible: boolean = true;
  @ViewChild('chartCanvas2', { static: true }) canvasRef!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.customerChart();
  }

  customerChart() {
    let chart = am4core.create(this.canvasRef.nativeElement, am4charts.XYChart);
    chart.colors.step = 2;
    chart.logo.disabled = true;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = 'right';
    chart.exporting.menu.verticalAlign = 'top';
    let legend = new am4charts.Legend();
    legend.position = 'top';
    legend.paddingBottom = 20;
    legend.labels.template.maxWidth = 95;
    chart.legend = legend;

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = 'category';
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    chart.data = [
      { category: 'Jan', first: 40, second: 55 },
      { category: 'Feb', first: 30, second: 78 },
      { category: 'Mar', first: 27, second: 40 },
      { category: 'Apr', first: 50, second: 33 },
      { category: 'May', first: 27, second: 40 },
      { category: 'Jun', first: 50, second: 33 },
    ];

    this.chart = chart;
    this.createSeries(this.chart, 'first', 'Repeated Customer');
    this.createSeries(this.chart, 'second', 'New Customer');

    this.chart?.invalidateData();
  }

  private createSeries(chart: am4charts.XYChart, value: any, name: any) {
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = value;
    series.dataFields.categoryX = 'category';
    series.name = name;
    if (name === 'Repeated Customer') {
      series.columns.template.fill = am4core.color('#622cad');
    } else if (name === 'New Customer') {
      series.columns.template.fill = am4core.color('#fb6f10');
    }
    series.columns.template.width = am4core.percent(25);
    series.columns.template.tooltipText = '{name}: {valueY.value}';
    series.columns.template.strokeWidth = 0;
    series.columns.template.column.cornerRadiusTopLeft = 15;
    series.columns.template.column.cornerRadiusTopRight = 15;

    if (series.tooltip) {
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('#fb6f10');
    }

    series.events.on('hidden', () => {
      this.chart?.invalidateData();
    });
    series.events.on('shown', () => {
      this.chart?.invalidateData();
    });

    // Hide the legend item to hide the toggle button
    series.hiddenInLegend = true;

    return series;
  }

  toggleValueVisibility(seriesName: string) {
    console.log(`Toggling visibility for series: ${seriesName}`);
    if (this.chart) {
      let series = this.chart.series.values.find((s) => s.name === seriesName);
      if (series) {
        if (series.isHidden) {
          series.show();
          console.log(`${seriesName} series shown`);
        } else {
          series.hide();
          console.log(`${seriesName} series hidden`);
        }
        this.chart.invalidateData(); // Redraw the chart
      } else {
        console.log(`${seriesName} series not found, creating it`);
        // If the series doesn't exist, create it and set its visibility to true
        this.createSeries(
          this.chart,
          seriesName === 'Repeated Customer' ? 'first' : 'second',
          seriesName
        );
        this.chart.invalidateData(); // Redraw the chart
      }
    }
  }
}
