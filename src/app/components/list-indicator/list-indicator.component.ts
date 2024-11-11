import {
  Component,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

import { IDashboardItem } from '../../interfaces/dashboard';
import { colors } from '../../utils/colors';

@Component({
  selector: 'app-list-indicator',
  templateUrl: './list-indicator.component.html',
  styleUrls: ['./list-indicator.component.scss'],
})
export class ListIndicatorComponent implements OnDestroy, AfterViewInit, OnChanges {
  @Input() data!: IDashboardItem[] | any;
  @Input() header!: string;
  @Input() loading: boolean = true;
  @Input() type: string = 'count';
  @Input() chartType?: string;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['data'] && this.data) {
      this.data = this.data;
    }
  }

  getColor(index: number): string {
    return colors[index % colors.length];
  }


  getTextColor(bgColor: string): string {
    const rgb = parseInt(bgColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;


    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 128 ? 'black' : '#D4BE98';
  }

  ngOnDestroy() {}
}
