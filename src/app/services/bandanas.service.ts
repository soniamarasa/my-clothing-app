import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IBandana } from '@interfaces/bandana';

export interface IGetBandanasParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})

export class BandanasService {
  constructor(private readonly _http: HttpClient) {}

  getBandanas(queryParams?: IGetBandanasParams) {
    return this._http.get<IBandana[]>('bandanas', {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getBandanaById(id: IBandana['_id']) {
    return this._http.get<IBandana>(`bandanas/${id}`);
  }

  newBandana(bandana: IBandana) {
    return this._http.post<IBandana>('bandanas', bandana);
  }

  updateBandana(id: IBandana['_id'], body: IBandana) {
    return this._http.put<IBandana>(`bandanas/${id}`, body);
  }
}
