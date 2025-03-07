import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  interval,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import {
  IGetCategoriesParams,
  CategoriesService,
} from '@services/categories.service';

import { CategoriesStore } from '@stores/categories.store';

import { ICategory } from '@root/src/app/interfaces/category';

import { fixedCategories } from '@root/src/app/utils/valueTypes';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class CategoriesFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getCategories({ ...this._filter.value })));

  readonly categoriesState$ = combineLatest([
    this.categoriesStore.categoriesState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true }),
  );

  constructor(
    private categoriesService: CategoriesService,
    private categoriesStore: CategoriesStore,
  ) {}

  getCategories(queryParams?: IGetCategoriesParams) {
    return this.categoriesService.getCategories(queryParams).pipe(
      map((categories) => [...fixedCategories, ...categories]),
      tap((combinedCategories) =>
        this.categoriesStore.updateCategories(combinedCategories),
      ),
    );
  }

  getCategoryById(id: ICategory['_id']) {
    return this.categoriesService
      .getCategoryById(id)
      .pipe(tap((category) => this.categoriesStore.updateCategory(category)));
  }

  newCategory(category: ICategory) {
    return this.categoriesService
      .newCategory(category)
      .pipe(tap((category) => this.categoriesStore.updateCategory(category)));
  }

  updateCategory(category: ICategory) {
    return this.categoriesService
      .updateCategory(category)
      .pipe(tap((category) => this.categoriesStore.updateCategory(category)));
  }

  delete(category: ICategory) {
    return this.categoriesService
      .delete(category)
      .pipe(tap((category) => this.categoriesStore.deleteCategory(category)));
  }

  filterCategories(filter: IGetCategoriesParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
