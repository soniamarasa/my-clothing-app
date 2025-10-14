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
import { ClothesFacade } from '@root/src/app/facades/clothes.facade';

@Component({
  selector: 'app-planned-look-dialog',
  templateUrl: './planned-look-dialog.component.html',
  styleUrls: ['./planned-look-dialog.component.scss'],
})
export class PlannedLookDialog implements OnInit, OnDestroy {
  private subs = new SubSink();
  isNew: boolean = false;
  outerwear: IClothing[] = [];
  looks: IClothing[] = [];
  handbags: IHandbag[] = [];
  places: IPlace[] = [];
  bandanas: IBandana[] = [];
  accessories: IAccessory[] = [];
  status: any[] = statusLook;
  formHasChanged = false;
  ref?: DynamicDialogRef;

  plannedLookForm = this._fb.group({
    look: [null, [Validators.required]],
    coat: [null, []],
    handbag: [null, []],
    place: [null, [Validators.required]],
    date: [new Date(), [Validators.required]],
    bandana: [],
    accessories: [[]],
    status: [this.dialogData.statusId === 1 ? this.status[0] : this.status[1]],
  });

  constructor(
    public _ref: DynamicDialogRef,
    public _config: DynamicDialogConfig,
    public _dialogService: DialogService,
    public categoriesFacade: CategoriesFacade,
    public tagsFacade: TagsFacade,
    private _fb: UntypedFormBuilder,
    private clothesFacade: ClothesFacade,
  ) { }

  get dialogData(): any {
    return this._config.data;
  }

  ngOnInit(): void {
    this.unboxPlannedLookForm();
    this.status = statusLook;
    this.subs.add(
      this.clothesFacade
        .getClothes({ categoryId: 'customC04' })
        .subscribe((data) => (this.outerwear = data))
    );
  }

  get formValue() {
    return this.plannedLookForm?.value;
  }

  private unboxPlannedLookForm() {
    return new Promise<void>((resolve) => {
      if (this.dialogData) {

        this.looks = this.dialogData.looks;
        this.handbags = this.dialogData.handbags;
        this.bandanas = this.dialogData.bandanas;
        this.accessories = this.dialogData.accessories;
        this.places = this.dialogData.places;
        this.status = this.dialogData.status;

        if (this.dialogData?.item) {
          this.isNew = false;

          const itemData = {
            ...this.dialogData.item,
            date: new Date(this.dialogData.item.date), // Conversão aqui
          };

          this.plannedLookForm.addControl(
            '_id',
            this._fb.control(itemData._id, [Validators.required])
          );

          this.plannedLookForm.patchValue(itemData);
        } else {
          this.isNew = true;
          this.plannedLookForm.patchValue({ date: new Date() });
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

  getTextColor(bgColor: string): string {
    const rgb = parseInt(bgColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 128 ? 'black' : '#D4BE98';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
