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

import { IHandbag } from '@interfaces/handbag';
import { IPlace } from '@interfaces/place';
import { IAccessory } from '@interfaces/accessory';
import { IBandana } from '@interfaces/bandana';
import { statusLook } from '@root/src/app/utils/valueTypes';

@Component({
  selector: 'app-planned-look-dialog',
  templateUrl: './planned-look-dialog.component.html',
  styleUrls: ['./planned-look-dialog.component.scss'],
})
export class PlannedLookDialog implements OnInit, OnDestroy {
  private subs = new SubSink();
  isNew: boolean = false;
  coats: IClothing[] = [];
  looks: IClothing[] = [];
  handbags: IHandbag[] = [];
  places: IPlace[] = [];
  bandanas: IBandana[] = [];
  accessories: IAccessory[] = [];
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
    place: [null, [Validators.required]],
    date: [null, [Validators.required]],
    bandana: [],
    accessories: [[]],
    status: [this.dialogData.statusId === 1 ? this.status[0] : this.status[1]],
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
        this.bandanas = this.dialogData.bandanas;
        this.accessories = this.dialogData.accessories;
        this.places = this.dialogData.places;
        this.status = this.dialogData.status;

        if (this.dialogData?.item) {
          this.isNew = false;
          this.plannedLookForm.addControl(
            '_id',
            this._fb.control(this.dialogData.item._id, [Validators.required])
          );

          this.plannedLookForm.patchValue(this.dialogData.item);
        } else {
          this.isNew = true;
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

      // if (this.isNew) {
      //   data.status =
      //     this.dialogData.statusId === 1 ? this.status[0] : this.status[1];
      // }

      this._ref.close(data);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
