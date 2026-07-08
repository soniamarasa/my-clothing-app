import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { SubSink } from 'subsink';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { openClosetDialog } from '../../utils/closet-dialog';
import { IDashboardItem } from '../../interfaces/dashboard';
import { ListDialog } from '../dialogs/list-dialog/list-dialog.component';

@Component({
  standalone: false,
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  providers: [DialogService],
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {
  private subsink = new SubSink();
  ref?: DynamicDialogRef;
  @Input() data!: IDashboardItem[] | any;
  @Input() header!: string;
  @Input() loading: boolean = true;
  @Input() type: string = 'count';
  @Input() chartType?: string;
  showChart = true;

  constructor(
    public _dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['data'] && this.data) {
      this.showChart = this.data.result.length > 0;
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subsink.unsubscribe();
  }

  openDialog() {
    const ref = openClosetDialog(this._dialogService, ListDialog, {
      header: this.header,
      width: '500px',
      data: this.data,
      appendTo: 'body',
    });
  }
}
