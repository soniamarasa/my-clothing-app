import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { IDashboardItem } from '../../interfaces/dashboard';
import { SubSink } from 'subsink';
import { colors } from '../../utils/colors';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  private subsink = new SubSink();
  @Input() data!: any;
  @Input() type!: string;
  @ViewChild('chartCanvas', { static: false }) chartCanvas:
    | ElementRef<HTMLDivElement>
    | undefined;

  chart: Highcharts.Chart | undefined;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.data) {
      this.createChart(this.data.result);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['data'] && this.data) {
      this.createChart(this.data.result);
    }
  }

  createChart(result: IDashboardItem[]): void {
    if (!this.chartCanvas) {
      return;
    }

    const labels = result.map((item) => item.name);
    const dataSerieValues = result.map((item, index) => ({
      y: item.count === 0 ? null : item.count,
      color: colors[index % colors.length],
    }));

    this.chart = Highcharts.chart(this.chartCanvas.nativeElement, {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
      },
      title: {
        text: '',
        style: {
          fontSize: '1px',
        },
      },
      xAxis: {
        categories: labels,
        title: {
          text: '',
        },
        labels: {
          style: {
            fontFamily: 'DM Mono',
            color: '#D4BE98',
          },
        },
        gridLineColor: '#9f9f9f6b',
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: '',
        },
        labels: {
          style: {
            fontFamily: 'DM Mono',
            color: '#D4BE98',
          },
        },
        gridLineColor: '#9f9f9f6b',
      },
      tooltip: {
        style: {
          fontFamily: 'DM Mono',
          color: '#D4BE98',
        },
        backgroundColor: '#312F2E',
    
      },
      series: [
        {
          type: 'column',
          name: this.type,
          data: dataSerieValues,
          dataLabels: {
            enabled: true,
            style: {
              textOutline: 'none',
              fontFamily: 'DM Mono',
              color: '#D4BE98',
            },
          },
        } as Highcharts.SeriesColumnOptions,
      ],
      legend: {
        enabled: false,
      },
      credits: { enabled: false },
    });
  }

  ngOnDestroy() {
    this.subsink.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
