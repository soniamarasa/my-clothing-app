import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss'],
})
export class ListDialog implements OnInit, OnDestroy {
  private subs = new SubSink();

  constructor(
    public _ref: DynamicDialogRef,
    public _config: DynamicDialogConfig,
    public _dialogService: DialogService,
  ) {}

  get dialogData(): any {
    return this._config.data;
  }
  ngOnInit(): void {}

  onClose(confirmed?: boolean) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
