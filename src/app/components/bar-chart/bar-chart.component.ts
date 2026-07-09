import {
  Component,
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
import {
  buildSeriesColors,
  chartFontStyle,
  CHART_GRID,
  CHART_TEXT_MUTED,
  CHART_TOOLTIP_BG,
} from '../../utils/chart-theme';
import { sortByCountDesc } from '../../utils/chart-data';

@Component({
  standalone: false,
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnDestroy, OnChanges, AfterViewInit {
  @Input() data!: { total: number; result: IDashboardItem[] };
  @Input() type!: string;
  @Input() accent?: string;

  @ViewChild('chartCanvas', { static: false }) chartCanvas?:
    | ElementRef<HTMLDivElement>
    | undefined;

  chart: Highcharts.Chart | undefined;

  ngAfterViewInit(): void {
    if (this.data) {
      this.createChart(this.data.result);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.createChart(this.data.result);
    }
  }

  createChart(result: IDashboardItem[]): void {
    if (!this.chartCanvas) {
      return;
    }

    const chartItems = sortByCountDesc(result);
    const labels = chartItems.map((item) => item.name);
    const palette = buildSeriesColors(chartItems.length, this.accent);
    const chartHeight = Math.max(220, chartItems.length * 34 + 48);

    const dataSerieValues = chartItems.map((item, index) => ({
      y: item.count,
      color: palette[index],
    }));

    this.chart?.destroy();

    this.chart = Highcharts.chart(this.chartCanvas.nativeElement, {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: chartHeight,
        spacing: [4, 8, 4, 4],
      },
      title: { text: undefined },
      xAxis: {
        categories: labels,
        lineWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            ...chartFontStyle(),
            fontSize: '11px',
          },
        },
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        tickInterval: 1,
        title: { text: undefined },
        gridLineColor: CHART_GRID,
        labels: {
          style: chartFontStyle(CHART_TEXT_MUTED),
        },
      },
      tooltip: {
        style: chartFontStyle(),
        backgroundColor: CHART_TOOLTIP_BG,
        borderColor: 'rgba(255,255,255,0.08)',
        pointFormat: '<b>{point.y}</b> usos',
      },
      series: [
        {
          type: 'bar',
          name: this.type,
          data: dataSerieValues,
          borderRadius: 6,
          pointPadding: 0.12,
          groupPadding: 0.08,
          dataLabels: {
            enabled: true,
            align: 'right',
            inside: true,
            style: {
              ...chartFontStyle('#1a1918'),
              fontSize: '10px',
              textOutline: 'none',
              fontWeight: '700',
            },
          },
        } as Highcharts.SeriesBarOptions,
      ],
      legend: { enabled: false },
      credits: { enabled: false },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
