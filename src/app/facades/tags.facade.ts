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

import { IGetTagsParams, TagsService } from '@services/tags.service';

import { TagsStore } from '@stores/tags.store';

import { ITag } from '@root/src/app/interfaces/tag';

const REFRESH_INTERVAL = 600000;

@Injectable({
  providedIn: 'root',
})
export class TagsFacade {
  private readonly autoRefresh$ = interval(REFRESH_INTERVAL).pipe(startWith(0));
  private readonly _refresh = new BehaviorSubject(undefined);

  private readonly _filter = new BehaviorSubject<any>({});
  readonly filter$ = this._filter.asObservable().pipe(distinctUntilChanged());

  private readonly handleRequest$ = combineLatest([
    this.filter$,
    this.autoRefresh$,
    this._refresh.asObservable(),
  ]).pipe(switchMap(() => this.getTags({ ...this._filter.value })));

  readonly tagsState$ = combineLatest([
    this.tagsStore.tagsState$,
    this.handleRequest$,
  ]).pipe(
    map(([state]) => state),
    shareReplay({ refCount: true })
  );

  constructor(private tagsService: TagsService, private tagsStore: TagsStore) {}

  getTags(queryParams?: IGetTagsParams) {
    return this.tagsService
      .getTags(queryParams)
      .pipe(tap((tags) => this.tagsStore.updateTags(tags)));
  }

  getTagById(id: ITag['_id']) {
    return this.tagsService
      .getTagById(id)
      .pipe(tap((tag) => this.tagsStore.updateTag(tag)));
  }

  newTag(tag: ITag) {
    return this.tagsService
      .newTag(tag)
      .pipe(tap((tag) => this.tagsStore.updateTag(tag)));
  }

  updateTag(id: ITag['_id'], body: ITag) {
    return this.tagsService
      .updateTag(id, body)
      .pipe(tap((tag) => this.tagsStore.updateTag(tag)));
  }

  filterTags(filter: IGetTagsParams) {
    this._filter.next({ ...this._filter.value, ...filter });
  }

  refresh() {
    this._refresh.next(undefined);
  }
}
