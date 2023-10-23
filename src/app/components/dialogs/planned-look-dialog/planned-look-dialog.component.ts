import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { filter, map } from 'rxjs';
import { SubSink } from 'subsink';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { CategoriesFacade } from '@facades/categories.facade';
import { TagsFacade } from '@facades/tags.facade';
import { IClothing } from '@interfaces/clothing';
import { ITag } from '@interfaces/tag';
import { IHandbag } from '@interfaces/handbag';
import { IPlace } from '@interfaces/place';
import { statusLook } from '@root/src/app/utils/valueTypes';

@Component({
  selector: 'app-planned-look-dialog',
  templateUrl: './planned-look-dialog.component.html',
  styleUrls: ['./planned-look-dialog.component.scss'],
})
export class PlannedLookDialog implements OnInit, OnDestroy {
  private subs = new SubSink();

  coats: IClothing[] = [];
  looks: IClothing[] = [];
  handbags: IHandbag[] = [];
  places: IPlace[] = [];
  tags: ITag[] = [];
  status: any[] = statusLook;

  formHasChanged = false;
  ref?: DynamicDialogRef;

  get dialogData(): any {
    return this._config.data;
  }

  plannedLookForm = this._fb.group({
    look: [null, [Validators.required]],
    coat: [null, []],
    handbag: [null, []],
    place: [null, []],
    date: [null, []],
    tag: [null, []],
    status: [null, [Validators.required]],
  });

  constructor(
    public _ref: DynamicDialogRef,
    public _config: DynamicDialogConfig,
    public _dialogService: DialogService,
    private _fb: UntypedFormBuilder,
    public categoriesFacade: CategoriesFacade,
    public tagsFacade: TagsFacade
  ) {}

  ngOnInit(): void {
    this.unboxPlannedLookForm();
    this.status = statusLook;
  }

  get formValue() {
    return this.plannedLookForm?.value;
  }

  private unboxPlannedLookForm() {
    return new Promise<void>((resolve) => {
      if (this.dialogData) {
        this.coats = this.dialogData.coats;
        this.looks = this.dialogData.looks;
        this.handbags = this.dialogData.handbags;
        this.tags = this.dialogData.tags.filter((item: ITag) => item.type === "Usos" );
        this.places = this.dialogData.places;
        this.status = this.dialogData.status;

        if (this.dialogData?.item) {
          this.plannedLookForm.addControl(
            '_id',
            this._fb.control(this.dialogData.item._id, [Validators.required])
          );

          this.plannedLookForm.patchValue(this.dialogData.item);
        }
      }
      resolve();
    });
  }

  onClose(confirmed?: boolean) {
    if (!confirmed) {
      this._ref.close();
    } else {
      let data = this.plannedLookForm.value;

      this._ref.close(data);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
