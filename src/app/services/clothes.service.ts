import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IClothing } from '@interfaces/clothing';

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
    return this._http.get<IClothing[]>('clothes', {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getClothingById(id: IClothing['_id']) {
    return this._http.get<IClothing>(`clothes/${id}`);
  }

  newClothing(clothing: IClothing) {
    return this._http.post<IClothing>('clothes', clothing);
  }

  updateClothing(id: IClothing['_id'], body: IClothing) {
    return this._http.put<IClothing>(`clothes/${id}`, body);
  }
}
