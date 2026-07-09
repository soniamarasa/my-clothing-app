import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IDashboardItem } from '../../interfaces/dashboard';
import { buildSeriesColors } from '../../utils/chart-theme';
import { sortByCountDesc } from '../../utils/chart-data';
import { colors } from '../../utils/colors';

@Component({
  standalone: false,
  selector: 'app-list-indicator',
  templateUrl: './list-indicator.component.html',
  styleUrls: ['./list-indicator.component.scss'],
})
export class ListIndicatorComponent implements OnChanges {
  @Input() data!: { total: number; result: IDashboardItem[] };
  @Input() accent?: string;

  items: IDashboardItem[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.items = sortByCountDesc(this.data.result ?? []);
    }
  }

  getColor(index: number): string {
    if (this.accent) {
      return buildSeriesColors(this.items.length, this.accent)[index];
    }

    return colors[index % colors.length];
  }

  getTextColor(bgColor: string): string {
    const hexMatch = bgColor.match(/#([0-9a-f]{6})/i);
    const rgbaMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);

    let r = 0;
    let g = 0;
    let b = 0;

    if (hexMatch) {
      const rgb = parseInt(hexMatch[1], 16);
      r = (rgb >> 16) & 0xff;
      g = (rgb >> 8) & 0xff;
      b = rgb & 0xff;
    } else if (rgbaMatch) {
      r = Number(rgbaMatch[1]);
      g = Number(rgbaMatch[2]);
      b = Number(rgbaMatch[3]);
    }

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 150 ? '#1a1918' : '#D4BE98';
  }
}
