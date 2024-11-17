import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPlannedLook } from '@interfaces/plannedLook';
import { environment } from './../../environments/environment';

export interface IGetPlannedLooksParams {
  status?: number;
  year?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlannedLooksService {
  constructor(private readonly _http: HttpClient) {}

  getPlannedLooks(queryParams?: IGetPlannedLooksParams) {
    return this._http.get<IPlannedLook[]>(`${environment.url}/plannedLooks`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getPlannedLookById(id: IPlannedLook['_id']) {
    return this._http.get<IPlannedLook>(
      `${environment.url}/plannedLooks/${id}`
    );
  }

  newPlannedLook(plannedLook: IPlannedLook) {
    return this._http.post<IPlannedLook>(
      `${environment.url}/plannedLooks`,
      plannedLook
    );
  }

  updatePlannedLook(plannedLook: IPlannedLook) {
    return this._http.put<IPlannedLook>(
      `${environment.url}/plannedLooks/${plannedLook._id}`,
      plannedLook
    );
  }
}
