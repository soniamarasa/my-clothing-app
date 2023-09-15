import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ITag } from '@interfaces/tag';
import { environment } from './../../environments/environment';

export interface IGetTagsParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(private readonly _http: HttpClient) {}

  getTags(queryParams?: IGetTagsParams) {
    return this._http.get<ITag[]>(`${environment.url}/tags`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getTagById(id: ITag['_id']) {
    return this._http.get<ITag>(`${environment.url}/tags/${id}`);
  }

  newTag(tag: ITag) {
    return this._http.post<ITag>(`${environment.url}/tags`, tag);
  }

  updateTag(id: ITag['_id'], body: ITag) {
    return this._http.put<ITag>(`${environment.url}/tags/${id}`, body);
  }
}
