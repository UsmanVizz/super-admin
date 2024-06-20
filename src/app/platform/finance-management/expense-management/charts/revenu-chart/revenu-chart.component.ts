import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-revenu-chart',
  templateUrl: './revenu-chart.component.html',
  styleUrls: ['./revenu-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class RevenuChartComponent implements OnInit {
  @Output() ratingChange = new EventEmitter<number>();
  chart: am4charts.XYChart | undefined;
  series1Visible: boolean = true;
  series2Visible: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('chartCanvas2', { static: true }) canvasRef!: ElementRef;

  ngOnInit(): void {
    this.saleChart();
  }
  saleChart() {
    let chart = am4core.create(this.canvasRef.nativeElement, am4charts.XYChart);

    chart.logo.disabled = true;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = 'right';
    chart.exporting.menu.verticalAlign = 'top';

    chart.data = [
      { date: '2022-07-29', value: 15 },
      { date: '2022-07-30', value: 36 },
      { date: '2022-07-31', value: 18 },
      { date: '2022-08-01', value: 73 },
      { date: '2022-08-02', value: 3 },
      { date: '2022-08-03', value: 64 },
      { date: '2022-08-04', value: 12 },
    ];

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.disabled = true; // Disabling grid lines on the x-axis
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.fill = am4core.color('#666666');

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color('#666666');

    let gradient = new am4core.LinearGradient();
    gradient.addColor(am4core.color('#622CAD'));
    gradient.addColor(am4core.color('#622cad14'));
    gradient.rotation = 90;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.fill = gradient;
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 3;
    series.minBulletDistance = 10;
    series.tensionX = 0.8;
    series.tensionY = 0.8;
    series.tooltipText = '{valueY.value}';
    series.fillOpacity = 0.5;
    series.stroke = am4core.color('#fb6f10');
    series.defaultState.transitionDuration = 2000;
    series.hiddenState.transitionDuration = 2000;

    if (series.tooltip) {
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('#fb6f10');
    }

    // Find the highest value
    let maxValue = Math.max.apply(
      Math,
      chart.data.map(function (o) {
        return o.value;
      })
    );
    series.events.on('validated', function () {
      series.dataItems.each(function (dataItem) {
        let bullet = dataItem.bullets.getKey(series.uid);
        if (bullet) {
          if (dataItem.valueY === maxValue) {
            bullet.y = valueAxis.valueToPoint(maxValue).y;
          }
        }
      });
    });

    chart.cursor = new am4charts.XYCursor();
  }

  toggleValue1Visibility() {
    this.series1Visible = !this.series1Visible;
    if (this.chart) {
      let series = this.chart.series.values.find(
        (s) => s.dataFields.valueY === 'value1'
      );
      if (series) {
        series.hidden = this.series1Visible;
        this.series1Visible ? series.show() : series.hide();
        console.log('Value 1 visibility toggled');
      }
    }
  }

  toggleValue2Visibility() {
    this.series2Visible = !this.series2Visible;
    if (this.chart) {
      let series = this.chart.series.values.find(
        (s) => s.dataFields.valueY === 'value2'
      );
      if (series) {
        series.hidden = this.series2Visible;
        this.series2Visible ? series.show() : series.hide();
        console.log('Value 2 visibility toggled');
      }
    }
  }
}
