import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPlace } from '@interfaces/place';
import { environment } from './../../environments/environment';

export interface IGetPlacesParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private readonly _http: HttpClient) {}

  getPlaces(queryParams?: IGetPlacesParams) {
    return this._http.get<IPlace[]>(`${environment.url}/places`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getPlaceById(id: IPlace['_id']) {
    return this._http.get<IPlace>(`${environment.url}/places/${id}`);
  }

  newPlace(place: IPlace) {
    return this._http.post<IPlace>(`${environment.url}/places`, place);
  }

  updatePlace(id: IPlace['_id'], body: IPlace) {
    return this._http.put<IPlace>(`${environment.url}/places/${id}`, body);
  }
}
