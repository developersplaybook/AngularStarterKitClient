// global-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private _loading = new BehaviorSubject<boolean>(false);
  private _isAuthorized = new BehaviorSubject<boolean>(false);
  private _token = new BehaviorSubject<string | null>(null);

  // Exposing BehaviorSubjects directly for state updates and direct value access
  loading = this._loading.asObservable();
  isAuthorized = this._isAuthorized.asObservable();
  token = this._token.asObservable();

  // Exposing BehaviorSubjects directly for value access
  get loadingSubject() {
    return this._loading;
  }


  get isAuthorizedSubject() {
    return this._isAuthorized;
  }

  get tokenSubject() {
    return this._token;
  }

  // Methods to update state
  setLoading(value: boolean) {
    this._loading.next(value);
  }


  setIsAuthorized(isAuthorized: boolean) {
    this._isAuthorized.next(isAuthorized);
  }

  setToken(token: string | null) {
    this._token.next(token);
  }
}
