import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: "app-report-chart",
  templateUrl: "./report-chart.component.html",
  styleUrls: ["./report-chart.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class ReportChartComponent implements OnInit {
  @ViewChild("chartCanvas2", { static: true }) canvasRef!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.profittChart();
  }

  profittChart() {
    let chart = am4core.create(this.canvasRef.nativeElement, am4charts.XYChart);

    // Add percent sign to all numbers
    chart.numberFormatter.numberFormat = "#.#'%'";

    chart.logo.disabled = true;
    chart.width = 437;

    // Add data
    chart.data = [
      {
        country: "USA",
        year2005: 4.2,
      },
      {
        country: "UK",
        year2005: 3.1,
      },
      {
        country: "Canada",
        year2005: 2.9,
      },
      {
        country: "Japan",
        year2005: 2.3,
      },
      {
        country: "France",
        year2005: 2.1,
      },
      {
        country: "Brazil",
        year2005: 4.9,
      },

      {
        country: "Canada",
        year2005: 2.9,
      },
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    // categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis: any = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.title.text = "GDP growth rate";
    // valueAxis.title.fontWeight = 800;

    chart.xAxes.push(new am4charts.CategoryAxis());

    // Hide category axis labels
    let xAxis = chart.xAxes.getIndex(0);
    if (xAxis) {
      xAxis.renderer.labels.template.disabled = true;
    }

    // Hide value axis labels
    let yAxis = chart.yAxes.getIndex(0);
    if (yAxis) {
      yAxis.renderer.labels.template.disabled = true;
    }

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "year2005";
    series1.dataFields.categoryX = "country";
    series1.clustered = false;
    series1.columns.template.width = am4core.percent(30);
    series1.tooltipText = "GDP grow in {categoryX} (2005): [bold]{valueY}[/]";
    series1.fill = am4core.color("#fb6f10");
    series1.stroke = am4core.color("#fb6f10");

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;
  }
}
