import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { SubSink } from 'subsink';
import { IDashboardItem } from '../../interfaces/dashboard';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  private subsink = new SubSink();
  @Input() data!: IDashboardItem[] | any;
  @Input() header!: string;
  @Input() loading: boolean = true;
  @Input() type: string = 'count';
  @Input() chartType?: string;
  showChart = true;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['data'] && this.data) {
      this.showChart = this.data.result.length > 0;
    }
  }

  ngOnDestroy() {
    this.subsink.unsubscribe();
  }
}
