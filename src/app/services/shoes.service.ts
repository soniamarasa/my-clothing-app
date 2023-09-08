import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IShoe } from '@interfaces/shoe';

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
    return this._http.get<IShoe[]>('shoes', {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getShoeById(id: IShoe['_id']) {
    return this._http.get<IShoe>(`shoes/${id}`);
  }

  newShoe(shoe: IShoe) {
    return this._http.post<IShoe>('shoes', shoe);
  }

  updateShoe(id: IShoe['_id'], body: IShoe) {
    return this._http.put<IShoe>(`shoes/${id}`, body);
  }
}
