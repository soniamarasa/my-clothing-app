import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// --- Interfaces ---
import { ICategory } from '@interfaces/category';

export const INITIAL_STATE: ICategory[] = [];

@Injectable({
  providedIn: 'root',
})
export class CategoriesStore {
  private _categoriesState = new BehaviorSubject<ICategory[]>(INITIAL_STATE);
  readonly categoriesState$ = this._categoriesState.asObservable();

  constructor() {}

  updateCategories(categories: ICategory[]) {
    let data = [];

    data.push(...categories);

    this._categoriesState.next(data);

    return this._categoriesState.asObservable();
  }

  updateCategory(category: ICategory) {
    const state = this._categoriesState.value;

    const categoryIndex = state.findIndex(({ _id }) => _id === category._id);

    if (categoryIndex >= 0) {
      state[categoryIndex] = { ...state[categoryIndex], ...category };
    } else {
      state.push(category);
    }

    const data = state;

    this._categoriesState.next(data);

    return this._categoriesState.asObservable();
  }

  deleteCategory(category: ICategory) {
    const state = this._categoriesState.value;

    const categoryIndex = state.findIndex(({ _id }) => _id === category._id);

    state.splice(categoryIndex, 1);

    const data = state;

    this._categoriesState.next(data);

    return this._categoriesState.asObservable();
  }
}
