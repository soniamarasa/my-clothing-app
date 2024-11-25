import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IHandbag } from '@interfaces/handbag';
import { environment } from './../../environments/environment';

export interface IGetHandbagsParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class HandbagsService {
  constructor(private readonly _http: HttpClient) {}

  getHandbags(queryParams?: IGetHandbagsParams) {
    return this._http.get<IHandbag[]>(`${environment.url}/handbags`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getHandbagById(id: IHandbag['_id']) {
    return this._http.get<IHandbag>(`${environment.url}/handbags/${id}`);
  }

  newHandbag(handbag: IHandbag) {
    return this._http.post<IHandbag>(`${environment.url}/handbags`, handbag);
  }

  updateHandbag(handbag: IHandbag) {
    return this._http.put<IHandbag>(
      `${environment.url}/handbags/${handbag._id}`,
      handbag,
    );
  }

  delete(handbag: IHandbag) {
    return this._http.delete<IHandbag>(
      `${environment.url}/handbags/${handbag._id}`,
    );
  }
}
