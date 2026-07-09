import {
  Component,
  OnDestroy,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { SubSink } from 'subsink';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { openClosetDialog } from '../../utils/closet-dialog';
import { getTopItemName } from '../../utils/chart-data';
import { ListDialog } from '../dialogs/list-dialog/list-dialog.component';

@Component({
  standalone: false,
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  providers: [DialogService],
})
export class ChartComponent implements OnDestroy, OnChanges {
  private subsink = new SubSink();
  ref?: DynamicDialogRef;

  @Input() data!: { total: number; result: { id: string; name: string; count: number }[] };
  @Input() header!: string;
  @Input() loading = true;
  @Input() chartType?: string;
  @Input() accent?: string;
  @Input() icon?: string;

  showChart = true;
  subtitle = '';

  constructor(
    public _dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.showChart = this.data.result.length > 0;
      this.subtitle = this.buildSubtitle();
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  openDialog(): void {
    openClosetDialog(this._dialogService, ListDialog, {
      header: this.header,
      width: '500px',
      data: this.data,
      appendTo: 'body',
    });
  }

  private buildSubtitle(): string {
    if (!this.data) {
      return '';
    }

    const total = this.data.total ?? 0;
    const topItem = getTopItemName(this.data.result);
    const totalLabel = `${total} ${total === 1 ? 'uso' : 'usos'}`;

    if (!topItem) {
      return totalLabel;
    }

    return `${totalLabel} · mais usado: ${topItem}`;
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }
}
