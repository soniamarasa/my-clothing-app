import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    return JSON.parse(localStorage.getItem(key) as string);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
