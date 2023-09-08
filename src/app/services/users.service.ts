import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// --- Interfaces ---
import { IUser } from '@interfaces/user';

export interface IGetUsersParams {
  createdAfter?: Date;
  inactivated?: boolean;
  page?: number;
  pageLimit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly _http: HttpClient) {}

  getUsers(queryParams?: IGetUsersParams) {
    return this._http.get<IUser[]>('users', {
      params: (<unknown>queryParams) as HttpParams,
    });
  }

  getUserById(id: IUser['_id']) {
    return this._http.get<IUser>(`users/${id}`);
  }

  newUser(user: IUser) {
    return this._http.post<IUser>('users', user);
  }

  updateUser(id: IUser['_id'], body: IUser) {
    return this._http.put<IUser>(`users/${id}`, body);
  }

  updatePassword(password: IUser['password'], token: IUser['token']) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this._http.put(
      'users/password',
      { password, hostname: window.location.host },
      { headers }
    );
  }
}
