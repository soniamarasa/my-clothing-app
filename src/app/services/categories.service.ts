import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICategory } from '@interfaces/category';
import { environment } from './../../environments/environment';

export interface IGetCategoriesParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private readonly _http: HttpClient) {}

  getCategories(queryParams?: IGetCategoriesParams) {
    return this._http.get<ICategory[]>(`${environment.url}/categories`, {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getCategoryById(id: ICategory['_id']) {
    return this._http.get<ICategory>(`${environment.url}/categories/${id}`);
  }

  newCategory(category: ICategory) {
    return this._http.post<ICategory>(
      `${environment.url}/categories`,
      category
    );
  }

  updateCategory(category: ICategory) {
    return this._http.put<ICategory>(
      `${environment.url}/categories/${category._id}`,
      category
    );
  }
}
