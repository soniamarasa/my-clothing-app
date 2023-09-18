import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IShoe } from '@interfaces/shoe';
import { environment } from './../../environments/environment';

export interface IGetShoesParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})

export class ShoesService {
  constructor(private readonly _http: HttpClient) {}

  getShoes(queryParams?: IGetShoesParams) {
    return this._http.get<IShoe[]>(`${environment.url}/shoes`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getShoeById(id: IShoe['_id']) {
    return this._http.get<IShoe>(`${environment.url}/shoes/${id}`);
  }

  newShoe(shoe: IShoe) {
    return this._http.post<IShoe>(`${environment.url}/shoes`, shoe);
  }

  updateShoe(shoe: IShoe) {
    return this._http.put<IShoe>(`${environment.url}/shoes/${shoe._id}`, shoe);
  }
}
