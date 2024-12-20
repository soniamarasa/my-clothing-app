import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IBandana } from '@interfaces/bandana';
import { environment } from './../../environments/environment';

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
    return this._http.get<IBandana[]>(`${environment.url}/bandanas`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getBandanaById(id: IBandana['_id']) {
    return this._http.get<IBandana>(`${environment.url}/bandanas/${id}`);
  }

  newBandana(bandana: IBandana) {
    return this._http.post<IBandana>(`${environment.url}/bandanas`, bandana);
  }

  updateBandana(bandana: IBandana) {
    return this._http.put<IBandana>(
      `${environment.url}/bandanas/${bandana._id}`,
      bandana,
    );
  }

  delete(bandana: IBandana) {
    return this._http.delete<IBandana>(
      `${environment.url}/bandanas/${bandana._id}`,
    );
  }
}
