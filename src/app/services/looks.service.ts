import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ILook } from '@interfaces/look';

export interface IGetLooksParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})

export class LooksService {
  constructor(private readonly _http: HttpClient) {}

  getLooks(queryParams?: IGetLooksParams) {
    return this._http.get<ILook[]>('looks', {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getLookById(id: ILook['_id']) {
    return this._http.get<ILook>(`looks/${id}`);
  }

  newLook(look: ILook) {
    return this._http.post<ILook>('looks', look);
  }

  updateLook(id: ILook['_id'], body: ILook) {
    return this._http.put<ILook>(`looks/${id}`, body);
  }
}
