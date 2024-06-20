import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoverService {
  private passwordApi = environment.baseURL + environment.forGotPasswordApi;

  private updatePasswordUrl =
    environment.baseURL + environment.updatePasswordApi;

  constructor(private http: HttpClient) {}

  forGotPassword(obj: any): Observable<any> {
    return this.http.post(this.passwordApi, obj);
  }

  updateUserPwd(payload: any): Observable<any> {
    return this.http.put(this.updatePasswordUrl, payload);
  }
  // updateUserPwd(
  //   userId: string,
  //   userData: { password: string }
  // ): Observable<any> {
  //   const url = `${this.updatePasswordUrl}/${userId}`;
  //   return this.http.put<any>(url, userData);
  // }
}
