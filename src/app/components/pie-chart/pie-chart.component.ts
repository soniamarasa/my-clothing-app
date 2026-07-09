import {
  Component,
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
import {
  buildSeriesColors,
  chartFontStyle,
  CHART_TOOLTIP_BG,
  CHART_VIEW_HEIGHT,
} from '../../utils/chart-theme';
import { sortByCountDesc } from '../../utils/chart-data';

interface PieLegendItem {
  name: string;
  count: number;
  color: string;
}

@Component({
  standalone: false,
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnDestroy, AfterViewInit, OnChanges {
  @Input() data!: { total: number; result: IDashboardItem[] };
  @Input() type!: string;
  @Input() accent?: string;

  @ViewChild('chartContainer', { static: false }) chartContainer?:
    | ElementRef<HTMLDivElement>
    | undefined;

  chart: Highcharts.Chart | undefined;

  centerTotal = 0;
  useLegend = false;
  legendItems: PieLegendItem[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.data) {
      this.createChart(this.data);
    } else {
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.createChart(this.data);
    }
  }

  createChart(data: { total: number; result: IDashboardItem[] }): void {
    if (!this.chartContainer) {
      return;
    }

    const chartItems = sortByCountDesc(data.result).filter((item) => item.count > 0);
    const palette = buildSeriesColors(chartItems.length, this.accent);
    this.centerTotal =
      data.total ?? chartItems.reduce((sum, item) => sum + item.count, 0);
    this.useLegend = chartItems.length > 6;
    this.legendItems = chartItems.map((item, index) => ({
      name: item.name,
      count: item.count,
      color: palette[index],
    }));

    const seriesData = chartItems.map((item, index) => ({
      name: item.name,
      y: item.count,
      color: palette[index],
    }));

    const chartHeight =
      this.chartContainer.nativeElement.parentElement?.clientHeight ||
      CHART_VIEW_HEIGHT;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: chartHeight,
        spacing: [0, 0, 0, 0],
      },
      title: { text: undefined },
      series: [
        {
          type: 'pie',
          name: 'Usos',
          data: seriesData,
          innerSize: '58%',
          borderWidth: 0,
          showInLegend: false,
          dataLabels: {
            enabled: !this.useLegend,
            distance: 12,
            connectorWidth: 1,
            connectorColor: 'rgba(212, 190, 152, 0.35)',
            format: '{point.name}',
            style: {
              ...chartFontStyle(),
              fontSize: '10px',
              textOutline: 'none',
              fontWeight: '400',
            },
          },
        },
      ],
      legend: { enabled: false },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.y}</b> usos',
        style: chartFontStyle(),
        backgroundColor: CHART_TOOLTIP_BG,
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
      plotOptions: {
        pie: {
          size: '92%',
          center: ['50%', '50%'],
          allowPointSelect: false,
          cursor: 'default',
          states: {
            hover: {
              halo: {
                size: 6,
              },
            },
          },
        },
      },
      credits: { enabled: false },
    };

    this.chart?.destroy();

    this.chart = Highcharts.chart(
      this.chartContainer.nativeElement,
      chartOptions
    );

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
