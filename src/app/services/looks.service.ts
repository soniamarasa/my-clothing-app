import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ILook } from '@interfaces/look';
import { environment } from './../../environments/environment';

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
    return this._http.get<ILook[]>(`${environment.url}/looks`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getLookById(id: ILook['_id']) {
    return this._http.get<ILook>(`${environment.url}/looks/${id}`);
  }

  newLook(look: ILook) {
    return this._http.post<ILook>(`${environment.url}/looks`, look);
  }

  updateLook(look: ILook) {
    return this._http.put<ILook>(`${environment.url}/looks/${look._id}`, look);
  }
}
