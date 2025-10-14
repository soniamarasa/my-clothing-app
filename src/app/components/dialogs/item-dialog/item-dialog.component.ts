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
import { ICategory } from '@root/src/app/interfaces/category';
import { ITag } from '@root/src/app/interfaces/tag';

import { clothesTypes } from '@utils/valueTypes';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
})
export class ItemDialog implements OnInit, OnDestroy {
  private subs = new SubSink();

  types: any[] = [];
  clothesTypes = clothesTypes;
  showC1 = false;
  showIcon = false;
  showType = false;
  showCategory = false;
  showClothesType = false;
  categories: ICategory[] = [];
  tags: ITag[] = [];

  formHasChanged = false;
  ref?: DynamicDialogRef;

  get dialogData(): any {
    return this._config.data;
  }

  itemForm = this._fb.group({
    name: ['', [Validators.required]],
    color: ['#dd8e58'],
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
    this.unboxItemForm();
    this.types = this.dialogData.types || [];
  }

  get formValue() {
    return this.itemForm?.value;
  }

  private unboxItemForm() {
    return new Promise<void>((resolve) => {
      if (this.dialogData) {
        if (this.dialogData.type === 'clothing') {
          this.showC1 = true;

          this.subs.add(
            this.tagsFacade.getTags().subscribe((tags: ITag[]) => {
              this.tags = tags.filter(
                (obj) => obj.type === this.dialogData.category
              );
            })
          );

          this.itemForm.addControl(
            'tag',
            this._fb.control(null, [Validators.required])
          );

          this.itemForm.addControl('inactive', this._fb.control(false));
        }

        if (
          this.dialogData.type === 'clothing' ||
          this.dialogData.type === 'accessory' ||
          this.dialogData.type === 'shoe'
        ) {
          this.subs.add(
            this.categoriesFacade
              .getCategories()
              .subscribe((categories: ICategory[]) => {
                this.categories = categories.filter(
                  (obj) => obj.type === this.dialogData.category
                );
              })
          );

          this.showCategory = true;
          this.itemForm.addControl(
            'category',
            this._fb.control(null, [Validators.required])
          );
        }

        if (
          this.dialogData.type === 'category' ||
          this.dialogData.type === 'tag'
        ) {
          this.showType = true;
          this.itemForm.addControl(
            'type',
            this._fb.control(null, [Validators.required])
          );

          if (this.dialogData.type === 'tag') {
            this.itemForm.addControl(
              'clothesType',
              this._fb.control(null, [Validators.required])
            );
          }
        }

        if (
          this.dialogData.type === 'category' ||
          this.dialogData.type === 'place' ||
          this.dialogData.type === 'tag'
        ) {
          this.showIcon = true;
          this.itemForm.addControl(
            'icon',
            this._fb.control('🏷️', [Validators.required])
          );
        }

        if (this.dialogData?.item?._id) {
          this.isClothing(this.dialogData.item.type);
          this.itemForm.addControl(
            '_id',
            this._fb.control(this.dialogData.item._id, [Validators.required])
          );

          this.itemForm.patchValue(this.dialogData.item);
        }
      }
      resolve();
    });
  }

  isClothing(value: any) {
    if (value === 'Roupa') {
      this.showClothesType = true;
      this.itemForm.addControl(
        'clothesType',
        this._fb.control(null, [Validators.required])
      );
    } else {
      this.showClothesType = false;
      this.itemForm.removeControl('clothesType');
    }
  }

  onClose(confirmed?: boolean) {
    if (!confirmed) {
      this._ref.close();
    } else {
      let data = this.itemForm.value;

      this._ref.close(data);
    }
  }

  emoji(e: any) {
    this.itemForm.controls['icon'].setValue(e);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
