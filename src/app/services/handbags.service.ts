import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IHandbag } from '@interfaces/handbag';

export interface IGetHandbagsParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})

export class HandbagsService {
  constructor(private readonly _http: HttpClient) {}

  getHandbags(queryParams?: IGetHandbagsParams) {
    return this._http.get<IHandbag[]>('handbags', {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getHandbagById(id: IHandbag['_id']) {
    return this._http.get<IHandbag>(`handbags/${id}`);
  }

  newHandbag(handbag: IHandbag) {
    return this._http.post<IHandbag>('handbags', handbag);
  }

  updateHandbag(id: IHandbag['_id'], body: IHandbag) {
    return this._http.put<IHandbag>(`handbags/${id}`, body);
  }
}
