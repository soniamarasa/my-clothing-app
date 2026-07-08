import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
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
import { IShoe } from '@interfaces/shoe';
import { getLookOutfitLabel } from '../../../utils/planned-look-label';

type OutfitMode = 'separate' | 'garb';

@Component({
  standalone: false,
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
  tags: ITag[] = [];
  activeStep = 0;
  outfitMode: OutfitMode = 'separate';

  readonly steps = [
    { label: 'Base' },
    { label: 'Sapato' },
    { label: 'Tag' },
  ];

  formHasChanged = false;
  ref?: DynamicDialogRef;

  get dialogData(): any {
    return this._config.data;
  }

  lookForm = this._fb.group({
    top: [],
    bottom: [],
    garb: [],
    tag: [null, []],
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

  get previewLabel(): string {
    const value = this.lookForm.value;
    return getLookOutfitLabel({
      top: value.top,
      bottom: value.bottom,
      garb: value.garb,
      shoe: value.shoe,
      tag: value.tag,
    });
  }

  setOutfitMode(mode: OutfitMode): void {
    this.outfitMode = mode;

    if (mode === 'garb') {
      this.lookForm.patchValue({ top: null, bottom: null });
      return;
    }

    this.lookForm.patchValue({ garb: null });
  }

  canAdvance(): boolean {
    if (this.activeStep === 0) {
      if (this.outfitMode === 'garb') {
        return !!this.lookForm.value.garb;
      }

      return !!this.lookForm.value.top && !!this.lookForm.value.bottom;
    }

    if (this.activeStep === 1) {
      return this.lookForm.get('shoe')?.valid ?? false;
    }

    return this.lookForm.valid;
  }

  nextStep(): void {
    if (!this.canAdvance() || this.activeStep >= this.steps.length - 1) {
      return;
    }

    this.activeStep += 1;
  }

  prevStep(): void {
    if (this.activeStep > 0) {
      this.activeStep -= 1;
    }
  }

  private unboxLookForm() {
    return new Promise<void>((resolve) => {
      if (this.dialogData) {
        this.tops = this.dialogData.clothes[0];
        this.bottoms = this.dialogData.clothes[1];
        this.garbs = this.dialogData.clothes[2];
        this.shoes = this.dialogData.shoes;

        this.tags = this.dialogData.tags.filter(
          (item: ITag) => item.type === 'Usos'
        );

        if (this.dialogData?.item) {
          this.lookForm.addControl(
            '_id',
            this._fb.control(this.dialogData.item._id, [Validators.required])
          );

          this.lookForm.patchValue({ ...this.dialogData.item });
          this.outfitMode = this.dialogData.item.garb ? 'garb' : 'separate';
        }
      }
      resolve();
    });
  }

  onClose(confirmed?: boolean) {
    if (!confirmed) {
      this._ref.close();
      return;
    }

    const data = { ...this.lookForm.value };

    if (this.outfitMode === 'garb') {
      data.top = null;
      data.bottom = null;
    } else {
      data.garb = null;
    }

    this._ref.close(data);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
