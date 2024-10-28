import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IHandbag } from '@interfaces/handbag';
import { environment } from '../../environments/environment';
import { IDashboard } from '../interfaces/dashboard';

export interface IGetDashboardParams {
  year?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private readonly _http: HttpClient) {}

  getDashboard(queryParams?: IGetDashboardParams) {
    return this._http.get<IDashboard>(`${environment.url}/dashboard`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }
}
