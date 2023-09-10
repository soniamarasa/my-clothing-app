import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';

// --- Interfaces ---
import { IUser } from '@interfaces/user';

export interface ILoginBody {
  email: IUser['email'];
  password: IUser['password'];
}

export interface IRefreshTokenBody {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly _http: HttpClient) {}

  // --- POST endpoints ---
  login(body: ILoginBody) {
    return this._http.post<IUser>(`${environment.url}/login`, body);
  }

  retrievePassword(email: IUser['email'], host: string) {
    return this._http.post<any>(`${environment.url}/retrievePassword`, {
      email,
      host,
    });
  }

  resetPassword(password: IUser['password'], token: IUser['token']) {
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return this._http.post<any>(
      `${environment.url}/resetPassword`,
      {
        password,
      },
      { headers }
    );
  }

  logout(_id: IUser['_id']) {
    return this._http.post(`${environment.url}/logout`, { _id });
  }

  newUser(user: IUser) {
    return this._http.post<any>(`${environment.url}/createAccount`, user);
  }

  getUser(_id: IUser['_id']) {
    return this._http.get<any>(`${environment.url}/user/${_id}`);
  }

  updateUser(user: IUser) {
    return this._http.put<IUser>(`${environment.url}/updateUser/${user._id}`, user);
  }
}
