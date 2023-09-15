import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IAccessory } from '@interfaces/accessory';
import { environment } from './../../environments/environment';

export interface IGetAccessoriesParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})

export class AccessoriesService {
  constructor(private readonly _http: HttpClient) {}

  getAccessories(queryParams?: IGetAccessoriesParams) {
    return this._http.get<IAccessory[]>(`${environment.url}/accessories`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getAccessoryById(id: IAccessory['_id']) {
    return this._http.get<IAccessory>(`${environment.url}/accessories/${id}`);
  }

  newAccessory(accessory: IAccessory) {
    return this._http.post<IAccessory>(`${environment.url}/accessories`, accessory);
  }

  updateAccessory(id: IAccessory['_id'], body: IAccessory) {
    return this._http.put<IAccessory>(`${environment.url}/accessories/${id}`, body);
  }
}
