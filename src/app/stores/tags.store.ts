import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITag } from '@interfaces/tag';

export const INITIAL_STATE: ITag[] = [];

@Injectable({
  providedIn: 'root',
})
export class TagsStore {
  private _tagsState = new BehaviorSubject<ITag[]>(INITIAL_STATE);
  readonly tagsState$ = this._tagsState.asObservable();

  constructor() {}

  updateTags(tags: ITag[]) {
    let data = [];

    data.push(...tags);

    this._tagsState.next(data);

    return this._tagsState.asObservable();
  }

  updateTag(tag: ITag) {
    const state = [...this._tagsState.value];
    const index = state.findIndex(({ _id }) => _id === tag._id);

    if (index >= 0) {
      const updated = { ...state[index], ...tag };
      state.splice(index, 1);
      state.unshift(updated);
    } else {
      state.unshift(tag);
    }

    this._tagsState.next([...state]);
    return this._tagsState.asObservable();
  }

  deleteTag(tag: ITag) {
    const state = this._tagsState.value;

    const tagIndex = state.findIndex(({ _id }) => _id === tag._id);

    state.splice(tagIndex, 1);

    const data = state;

    this._tagsState.next(data);

    return this._tagsState.asObservable();
  }
}
