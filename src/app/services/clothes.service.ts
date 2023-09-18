import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IClothing } from '@interfaces/clothing';
import { environment } from './../../environments/environment';

export interface IGetClothesParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClothesService {
  constructor(private readonly _http: HttpClient) {}

  getClothes(queryParams?: IGetClothesParams) {
    return this._http.get<IClothing[]>(`${environment.url}/clothes`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getClothingById(id: IClothing['_id']) {
    return this._http.get<IClothing>(`${environment.url}/clothes/${id}`);
  }

  newClothing(clothing: IClothing) {
    return this._http.post<IClothing>(`${environment.url}/clothes`, clothing);
  }

  updateClothing(clothing: IClothing) {
    return this._http.put<IClothing>(`${environment.url}clothes/${clothing._id}`, clothing);
  }

  activate(id: IClothing['_id']) {
    return this._http.put<IClothing>(`${environment.url}clothes/active/${id}`, {});
  }

  inactivate(id: IClothing['_id']) {
    return this._http.put<IClothing>(`${environment.url}clothes/inactive${id}`, {});
  }
}
