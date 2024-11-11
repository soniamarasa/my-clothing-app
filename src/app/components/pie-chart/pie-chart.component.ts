import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { IDashboardItem } from '../../interfaces/dashboard';
import { colors } from '../../utils/colors';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnDestroy, AfterViewInit {
  @Input() data!: any;
  @Input() id!: string;
  @Input() type!: string;
  @ViewChild('chartContainer', { static: false }) chartContainer:
    | ElementRef
    | undefined;

  chartOptions: Highcharts.Options = {};
  chart: Highcharts.Chart | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.data) {
      this.createChart(this.data);
    } else {
      this.cdr.detectChanges();
    }
  }

  createChart(data: any) {
    if (!this.chartContainer) {
      this.cdr.detectChanges();
      return;
    }

    const sortedResult: IDashboardItem[] = data.result.sort(
      (a: IDashboardItem, b: IDashboardItem) => b.count - a.count
    );

    const largeSegments = sortedResult.filter((item) => item.count > 3);
    const mediumSegments = sortedResult.filter((item) => item.count === 3);
    const smallSegments = sortedResult.filter((item) => item.count <= 2);

    mediumSegments.sort((a, b) => a.count - b.count);

    const intercalatedResult: IDashboardItem[] = [];
    let largeIndex = 0,
      mediumIndex = 0,
      smallIndex = 0;

    while (
      largeIndex < largeSegments.length ||
      mediumIndex < mediumSegments.length ||
      smallIndex < smallSegments.length
    ) {
      if (smallIndex < smallSegments.length)
        intercalatedResult.push(smallSegments[smallIndex++]);
      if (largeIndex < largeSegments.length)
        intercalatedResult.push(largeSegments[largeIndex++]);
      if (mediumIndex < mediumSegments.length)
        intercalatedResult.push(mediumSegments[mediumIndex++]);
    }

    const seriesData = sortedResult.map((item, index) => ({
      name: item.name,
      y: item.count,
      color: colors[index % colors.length],
    }));

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        renderTo: this.chartContainer?.nativeElement,
        events: {
          load: () => {
            if (this.chart) {
              this.chart.reflow();
            }
          },
        },
        width: null,
      },
      title: {
        text: '',
        style: {
          fontSize: '1px',
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Total de Uso',
          data: seriesData,
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
            style: {
              fontSize: '10px',
              textOutline: 'none',
              fontFamily: 'DM Mono',
              color: '#D4BE98',
              width: 130,
              wordWrap: 'break-word',
            },
          },
        },
      ],
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      tooltip: {
        style: {
          useHTML: true,
          fontFamily: 'DM Mono',
          color: '#D4BE98',
        },
        backgroundColor: '#312F2E',
      },
      plotOptions:{
        pie: {
          size: '250px', // Reduz o tamanho do gráfico
          // center: ['50%', '50%'], // Centraliza o gráfico
        },
      },
      credits: { enabled: false },
    };


    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = Highcharts.chart(
      this.chartContainer.nativeElement,
      this.chartOptions
    );
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
