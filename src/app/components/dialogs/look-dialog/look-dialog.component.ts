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
import { IAccessory } from '@interfaces/accessory';
import { IShoe } from '@interfaces/shoe';
import { IBandana } from '@interfaces/bandana';

@Component({
  selector: 'app-look-dialog',
  templateUrl: './look-dialog.component.html',
  styleUrls: ['./look-dialog.component.scss'],
})
export class LookDialog implements OnInit, OnDestroy {
  private subs = new SubSink();

  tops: IClothing[] = [];
  bottoms: IClothing[] = [];
  garbs: IClothing[] = [];
  shoes: IShoe[] = [];
  bandanas: IBandana[] = [];
  accessories: IAccessory[] = [];

  formHasChanged = false;
  ref?: DynamicDialogRef;

  get dialogData(): any {
    return this._config.data;
  }

  lookForm = this._fb.group({
    top: [],
    bottom: [],
    garb: [],
    bandana: [],
    accessories: [[]],
    shoe: [, [Validators.required]],
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
    this.unboxLookForm();
  }

  get formValue() {
    return this.lookForm?.value;
  }

  private unboxLookForm() {
    return new Promise<void>((resolve) => {
      if (this.dialogData) {
        this.tops = this.dialogData.clothes[0];
        this.bottoms = this.dialogData.clothes[1];
        this.garbs = this.dialogData.clothes[2];
        this.shoes = this.dialogData.shoes;
        this.bandanas = this.dialogData.bandanas;

        this.accessories = this.dialogData.accessories;

        console.log(this.accessories, this.dialogData.item);

        if (this.dialogData?.item) {
          this.lookForm.addControl(
            '_id',
            this._fb.control(this.dialogData.item._id, [Validators.required])
          );

          this.lookForm.patchValue({ ...this.dialogData.item });
        }
      }
      resolve();
    });
  }

  onClose(confirmed?: boolean) {
    if (!confirmed) {
      this._ref.close();
    } else {
      let data = this.lookForm.value;

      this._ref.close(data);
    }
  }

  compareIds(obj1: any, obj2: any) {
		return obj1 && obj2 && obj1.id == obj2.id;
	}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
